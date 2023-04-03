import { adminGenericProxyFetch, IDeskproClient } from "@deskpro/app-sdk";
import { Settings } from "../types";
import { AuthTokens, ObjectMeta, RequestMethod } from "./types";
import { every, trimEnd } from "lodash";
import { isResponseError } from "./api";

/**
 * Get current user details (whilst app is not installed)
 */
export const getMePreInstalled = (client: IDeskproClient, settings: Settings) =>
  preInstalledRequest(
    client,
    settings,
    "/services/data/v55.0/chatter/users/me",
    "GET"
  );

/**
 * Get an sObject's metadata (whilst app is not installed)
 */
export const getObjectMetaPreInstalled = (
  client: IDeskproClient,
  settings: Settings,
  object: string
): Promise<ObjectMeta> =>
  preInstalledRequest(
    client,
    settings,
    `/services/data/v55.0/sobjects/${object}/describe`,
    "GET"
  );

export const getQueryableObjectsPreInstalled = async (
  client: IDeskproClient,
  settings: Settings,
  objects: string[]
) => {
  const data = (await preInstalledRequest(
    client,
    settings,
    "/services/data/v55.0/sobjects",
    "GET"
  )) as { sobjects: { queryable: boolean; name: string }[] };

  return data.sobjects
    .filter((obj) => obj.queryable && objects.includes(obj.name))
    .map((e) => e.name);
};

/**
 * Perform an authorized request before the app is installed
 */
const preInstalledRequest = async (
  client: IDeskproClient,
  settings: Settings,
  url: string,
  method: RequestMethod,
  data?: unknown
) => {
  if (
    !every([
      settings?.salesforce_instance_url,
      settings?.client_key,
      settings?.client_secret,
      settings?.global_access_token,
    ])
  ) {
    throw new Error(
      "Client key, secret, instance URL and global access tokens are not defined"
    );
  }

  const tokens: AuthTokens = JSON.parse(settings.global_access_token as string);

  const fetch = await adminGenericProxyFetch(client);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response = await fetch(
    trimEnd(
      new URL(settings.salesforce_instance_url as string).toString(),
      "/"
    ) + url,
    options
  );

  // If our access token has expired, attempt to get a new one using the refresh token
  if ([400, 401].includes(response.status)) {
    const refreshRequestOptions: RequestInit = {
      method: "POST",
      body: `grant_type=refresh_token&client_id=${
        settings?.client_key as string
      }&client_secret=${settings?.client_secret as string}&refresh_token=${
        tokens.refreshToken as string
      }`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const refreshRes = await fetch(
      new URL(
        `${settings.salesforce_instance_url}/services/oauth2/token`
      ).toString(),
      refreshRequestOptions
    );
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
      Authorization: `Bearer ${refreshedTokens.accessToken}`,
    };

    response = await fetch(
      trimEnd(
        new URL(settings.salesforce_instance_url as string).toString(),
        "/"
      ) + url,
      options
    );
  }

  if (isResponseError(response)) {
    throw new Error(
      `Request failed: [${response.status}] ${await response.text()}`
    );
  }

  return response.json();
};
