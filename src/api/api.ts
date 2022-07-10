import {
    adminGenericProxyFetch,
    IDeskproClient,
    proxyFetch,
} from "@deskpro/app-sdk";
import { AuthTokens, RequestMethod } from "./types";
import {every, trimEnd, trimStart} from "lodash";
import { Settings } from "../types";

/**
 * Get current user details
 */
export const getMe = (client: IDeskproClient) =>
    installedRequest(client, "/services/data/v55.0/chatter/users/me", "GET")
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
    if (response.status === 401) {
        const refreshRequestOptions: RequestInit = {
            method: "POST",
            body: new URLSearchParams({
                grant_type: "refresh_token",
                client_id: settings?.client_key as string,
                client_secret: settings?.client_secret as string,
                refresh_token: tokens.refreshToken as string,
            }).toString(),
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

    const response = await fetch(`__salesforce_instance_url__/${trimStart(url, "")}`, options);

    if (response.status === 401) {
        // todo: attempt refresh
    }

    return response.json();
};
