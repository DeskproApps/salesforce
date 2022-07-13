import {
    adminGenericProxyFetch,
    IDeskproClient,
    proxyFetch,
} from "@deskpro/app-sdk";
import { AuthTokens, RequestMethod } from "./types";
import {every, trimEnd, trimStart} from "lodash";
import { Account, Contact, Lead, User } from "./types";
import { Settings } from "../types";

/**
 * Get a list of Salesforce "Contact" sObjects by email
 */
export const getContactsByEmails = async (client: IDeskproClient, emails: string[]): Promise<Contact[]> => {
    const result: { searchRecords: { Id: string }[] } = await SOSLSearch(
        client,
        `FIND {${emails.map((e) => `"${e}"`).join(" OR ")}} RETURNING Contact`
    );

    return Promise.all(
        result.searchRecords.map(({ Id }) => getContactById(client, Id))
    );
};

/**
 * Get a list of Salesforce "Lead" sObjects by email
 */
export const getLeadsByEmails = async (client: IDeskproClient, emails: string[]): Promise<Lead[]> => {
    const result: { searchRecords: { Id: string }[] } = await SOSLSearch(
        client,
        `FIND {${emails.map((e) => `"${e}"`).join(" OR ")}} RETURNING Lead`
    );

    return Promise.all(
        result.searchRecords.map(({ Id }) => getLeadById(client, Id))
    );
};

/**
 * Get a list of Salesforce "Account" sObjects by name
 */
export const getAccountsByName = async (client: IDeskproClient, name: string): Promise<Account[]> => {
    const result: { searchRecords: { Id: string }[] } = await SOSLSearch(
        client,
        `FIND {${name.replace("'", "\\'")}} RETURNING Account`
    );

    return Promise.all(
        result.searchRecords.map(({ Id }) => getAccountById(client, Id))
    );
};

/**
 * Perform a SOSL search
 */
export const SOSLSearch = (client: IDeskproClient, sosl: string) =>
    installedRequest(client, `/services/data/v55.0/search/?q=${encodeURIComponent(sosl)}`, "GET")
;

/**
 * Get "Account" by ID
 */
export const getAccountById = (client: IDeskproClient, id: string): Promise<Account> =>
    installedRequest(client, `/services/data/v55.0/sobjects/Account/${id}`, "GET")
;

/**
 * Get "Lead" by ID
 */
export const getLeadById = (client: IDeskproClient, id: string): Promise<Lead> =>
    installedRequest(client, `/services/data/v55.0/sobjects/Lead/${id}`, "GET")
;

/**
 * Get "Contact" by ID
 */
export const getContactById = (client: IDeskproClient, id: string): Promise<Contact> =>
    installedRequest(client, `/services/data/v55.0/sobjects/Contact/${id}`, "GET")
;

/**
 * Get "User" by ID
 */
export const getUserById = (client: IDeskproClient, id: string): Promise<User> =>
    installedRequest(client, `/services/data/v55.0/sobjects/User/${id}`, "GET")
;

/**
 * Get an sObject's metadata
 */
export const getObjectMeta = (client: IDeskproClient, object: string) =>
    installedRequest(client, `/services/data/v55.0/sobjects/${object}/describe`, "GET")
;

/**
 * Get available API versions
 */
export const getApiVersions = (client: IDeskproClient) =>
    installedRequest(client, `/services/data`, "GET")
;

/**
 * Get current user details
 */
export const getMe = (client: IDeskproClient) =>
    installedRequest(client, "/services/data/v55.0/chatter/users/me", "GET")
;

/**
 * Get current user details (whilst app is not installed)
 */
export const getMePreInstalled = (client: IDeskproClient, settings: Settings, tokens: AuthTokens) =>
    preInstalledRequest(client, settings, tokens, "/services/data/v55.0/chatter/users/me", "GET")
;

/**
 * Perform an authorized request before the app is installed
 */
const preInstalledRequest = async (
    client: IDeskproClient,
    settings: Settings,
    tokens: AuthTokens,
    url: string,
    method: RequestMethod,
    data?: unknown
) => {
    if (!every([settings.salesforce_instance_url, settings.client_key, settings.client_secret])) {
        throw new Error("Client key, secret and instance URL are not defined");
    }

    const fetch = await adminGenericProxyFetch(client);

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${tokens.accessToken}`,
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    let response = await fetch(trimEnd(
        new URL(settings.salesforce_instance_url as string).toString(), "/") + url,
        options
    );

    // If our access token has expired, attempt to get a new one using the refresh token
    if ([400, 401].includes(response.status)) {
        const refreshRequestOptions: RequestInit = {
            method: "POST",
            body: `grant_type=refresh_token&client_id=${settings?.client_key as string}&client_secret=${settings?.client_secret as string}&refresh_token=${tokens.refreshToken as string}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        const refreshRes = await fetch(new URL(`${settings.salesforce_instance_url}/services/oauth2/token`).toString(), refreshRequestOptions);
        const refreshData = await refreshRes.json();

        const refreshedTokens: AuthTokens = {
            ...tokens,
            accessToken: refreshData.access_token,
        };

        const refreshedTokensEncoded = JSON.stringify(refreshedTokens);

        await client.setSetting("global_access_token", refreshedTokensEncoded);

        client?.setAdminSetting(refreshedTokensEncoded);

        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${refreshedTokens.accessToken}`,
        };

        response = await fetch(trimEnd(
            new URL(settings.salesforce_instance_url as string).toString(), "/") + url,
            options
        );
    }

    if (isResponseError(response)) {
        throw new Error(`Request failed: [${response.status}] ${await response.text()}`);
    }

    return response.json();
};

/**
 * Perform an authorized request after the app is installed
 */
const installedRequest = async (
    client: IDeskproClient,
    url: string,
    method: RequestMethod,
    data?: unknown
) => {
    const fetch = await proxyFetch(client);

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer __global_access_token.json("[accessToken]")__`,
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    let response = await fetch(`__salesforce_instance_url__/${trimStart(url, "")}`, options);

    if ([400, 401].includes(response.status)) {

        // todo: we need a better way of merge saving JSON encoded settings as this try/re-auth process will ALWAYS cause an
        //  unnecessary extra request after the first access token has expired.
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer [[oauth/global/accesstoken]]`,
        };

        response = await fetch(`__salesforce_instance_url__/${trimStart(url, "")}`, options);

        if ([400, 401].includes(response.status)) {
            const refreshRequestOptions: RequestInit = {
                method: "POST",
                body: `grant_type=refresh_token&client_id=__client_key__&client_secret=__client_secret__&refresh_token=__global_access_token.json("[refreshToken]")__`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            };

            const refreshRes = await fetch(`__salesforce_instance_url__/services/oauth2/token`, refreshRequestOptions);
            const refreshData = await refreshRes.json();

            await client.setState<string>("oauth/global/accesstoken", refreshData.access_token, {
                backend: true,
            });

            options.headers = {
                ...options.headers,
                "Authorization": `Bearer [[oauth/global/accesstoken]]`,
            };

            response = await fetch(`__salesforce_instance_url__/${trimStart(url, "")}`, options);
        }
    }

    if (isResponseError(response)) {
        throw new Error(`Request failed: [${response.status}] ${await response.text()}`);
    }

    return response.json();
};

const isResponseError = (response: Response) => (response.status < 200 || response.status >= 400);