import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { trimStart } from "lodash";
import {Account, Contact, Lead, User, ObjectMeta, Opportunity, RequestMethod, Note} from "./types";

/**
 * Get a list of opportunities by ContactID
 */
export const getOpportunitiesByContactId = async (client: IDeskproClient, contactId: string, limit?: number): Promise<Opportunity[]> => {
    const limitClause = limit === undefined ? "" : `LIMIT ${limit} OFFSET 0`;

    const result: { records: { Id: string }[] } = await SOQLSearch(
        client,
        `SELECT Id FROM Opportunity WHERE ContactID = '${contactId}' ${limitClause}`
    );

    return Promise.all(
        result.records.map(({ Id }) => getOpportunityById(client, Id))
    );
}

/**
 * Get a list of notes by ParentID
 */
export const getNotesByParentId = async (client: IDeskproClient, parentId: string, limit?: number): Promise<Note[]> => {
    const limitClause = limit === undefined ? "" : `LIMIT ${limit} OFFSET 0`;

    const result: { records: { Id: string }[] } = await SOQLSearch(
        client,
        `SELECT Id FROM Note WHERE ParentID = '${parentId}' ${limitClause}`
    );

    return Promise.all(
        result.records.map(({ Id }) => getNoteById(client, Id))
    );
}

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
 * Perform a SOQL search
 */
export const SOQLSearch = (client: IDeskproClient, soql: string) =>
    installedRequest(client, `/services/data/v55.0/query/?q=${encodeURIComponent(soql)}`, "GET")
;

/**
 * Get "Account" by ID
 */
export const getNoteById = (client: IDeskproClient, id: string): Promise<Note> =>
    installedRequest(client, `/services/data/v55.0/sobjects/Note/${id}`, "GET")
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
 * Get "Opportunity" by ID
 */
export const getOpportunityById = (client: IDeskproClient, id: string): Promise<Opportunity> =>
    installedRequest(client, `/services/data/v55.0/sobjects/Opportunity/${id}`, "GET")
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
export const getObjectMeta = (client: IDeskproClient, object: string): Promise<ObjectMeta> =>
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

export const isResponseError = (response: Response) => (response.status < 200 || response.status >= 400);
