import { adminGenericProxyFetch, IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { AuthTokens, RequestMethod } from "./types";

export const getMePreInstalled = (client: IDeskproClient, tokens: AuthTokens) => {
  const url = `https://deskproltd-dev-ed.my.salesforce.com/services/data/v24.0/chatter/users/me`; // todo: prefix this URL

  return preInstalledRequest(client, tokens, url, "GET");
};

/**
 * Perform an authorized request before the app is installed
 */
const preInstalledRequest = async (
    client: IDeskproClient,
    tokens: AuthTokens,
    url: string,
    method: RequestMethod,
    data?: unknown
) => {
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

    // todo: need to get base URL
    const response = await fetch(url, options);

    if (response.status === 401) {
        // todo: attempt refresh
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
            "Authorization": `Bearer __global_access_token.json("accessToken")__`,
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    // todo: need to get base URL
    const response = await fetch(url, options);

    if (response.status === 401) {
        // todo: attempt refresh
    }

    return response.json();
};
