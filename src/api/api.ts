import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { trimStart } from "lodash";
import { ObjectProperty } from "../screens/admin/types";
import { IActivity } from "../types";
import {
  Account,
  Contact,
  Lead,
  User,
  ObjectMeta,
  Opportunity,
  RequestMethod,
} from "./types";
import { escapeSOQLTerm, escapeSOSLTerm } from "./utils";

/**
 * Get a list of sObjects by FK
 */

export const getAllChildrenFromSobject = async (
  client: IDeskproClient,
  objects: ObjectProperty[],
  parent: Contact | Lead | Account
): Promise<
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }[][]
> => {
  const result = (await Promise.all(
    objects.map(async (obj) => {
      const isSingular = obj.associationType === "Single";

      if (isSingular && !parent[obj.field as keyof typeof parent]) return [];

      const meta = await getObjectsByFk(
        client,
        obj.object,
        isSingular ? "id" : obj.field,
        isSingular
          ? (parent[obj.field as keyof typeof parent] as string)
          : (parent.Id as string),
        3
      );

      return meta;
    })
  )) as unknown as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }[][];

  return result;
};

export const getAllActivities = async (
  client: IDeskproClient,
  id: string,
  field: string,
  limit?: number
): Promise<IActivity[]> => {
  const tasks = getObjectsByFk(
    client,
    "Task",
    field,
    id,
    limit
  ) as unknown as Promise<IActivity>;

  const events = getObjectsByFk(
    client,
    "Event",
    field,
    id,
    limit
  ) as unknown as Promise<IActivity>;

  const joined = (await Promise.all([tasks, events])).flat().map((e) => ({
    ...e,
  }));

  return joined
    .flat()
    .sort(
      (a, b) =>
        new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime()
    )
    .reverse();
};

export const getObjectsByQuery = async (
  client: IDeskproClient,
  query: string,
  limit?: number
): Promise<Opportunity[]> => {
  const limitClause =
    limit === undefined
      ? ""
      : `ORDER BY createddate DESC LIMIT ${limit} OFFSET 0`;

  const result: { records: Opportunity[] } = await SOQLSearch(
    client,
    `${query} ${limitClause}`
  );

  return result.records;
};

export const getObjectsByFk = async (
  client: IDeskproClient,
  object: string,
  field: string,
  id: string,
  limit?: number
): Promise<unknown[]> => {
  const limitClause =
    limit === undefined
      ? ""
      : `ORDER BY createddate DESC LIMIT ${limit} OFFSET 0`;

  const result: { records: Opportunity[] } = await SOQLSearch(
    client,
    `SELECT FIELDS(ALL) FROM ${object} WHERE ${field} = '${id}' ${limitClause}`
  );

  return result.records;
};

export const editData = (
  client: IDeskproClient,
  object: string,
  id: string,
  data: unknown
): Promise<unknown> =>
  installedRequest(
    client,
    `/services/data/v55.0/sobjects/${object}/Id/${id}`,
    "PATCH",
    data
  );

export const postData = (
  client: IDeskproClient,
  object: string,
  data: unknown
): Promise<unknown> =>
  installedRequest(
    client,
    `/services/data/v55.0/sobjects/${object}`,
    "POST",
    data
  );

/**
 * Get an sObject by ID
 */
export const getObjectById = <T = unknown>(
  client: IDeskproClient,
  object: string,
  id: string
): Promise<T> =>
  installedRequest(
    client,
    `/services/data/v55.0/sobjects/${object}/${id}`,
    "GET"
  );

/**
 * Get a list of Salesforce "Contact" sObjects by email
 */
export const getContactsByEmails = async (
  client: IDeskproClient,
  emails: string[]
): Promise<Contact[]> => {
  const result: { searchRecords: { Id: string }[] } = await SOSLSearch(
    client,
    `FIND {${emails
      .map((e) => `"${escapeSOSLTerm(e)}"`)
      .join(" OR ")}} RETURNING Contact`
  );

  return Promise.all(
    result.searchRecords.map(({ Id }) =>
      getObjectById<Contact>(client, "Contact", Id)
    )
  );
};

export const getContactByEmail = async (
  client: IDeskproClient,
  email: string
): Promise<Contact> => {
  const result: { searchRecords: { Id: string }[] } = await SOSLSearch(
    client,
    `FIND {"${escapeSOSLTerm(email)}"} RETURNING Contact`
  );

  return getObjectById<Contact>(client, "Contact", result.searchRecords[0]?.Id);
};

 
export const getLeadsByEmails = async (
  client: IDeskproClient,
  emails: string[]
): Promise<Lead[]> => {
  const result: { searchRecords: { Id: string }[] } = await SOSLSearch(
    client,
    `FIND {${emails
      .map((e) => `"${escapeSOSLTerm(e)}"`)
      .join(" OR ")}} RETURNING Lead`
  );

  return Promise.all(
    result.searchRecords.map(({ Id }) =>
      getObjectById<Lead>(client, "Lead", Id)
    )
  );
};

/**
 * Get a list of Salesforce "Account" sObjects by name
 */
export const getAccountsByName = async (
  client: IDeskproClient,
  name: string
): Promise<Account[]> => {
  const result: { records: Account[] } = await SOQLSearch(
    client,
    `SELECT FIELDS(ALL) FROM Account WHERE Name = '${escapeSOQLTerm(
      name
    )}' LIMIT 200`
  );

  return result.records;
};

/**
 * Perform a SOSL search
 */
export const SOSLSearch = (client: IDeskproClient, sosl: string) =>
  installedRequest(
    client,
    `/services/data/v55.0/search/?q=${encodeURIComponent(sosl)}`,
    "GET"
  );

/**
 * Perform a SOQL search
 */
export const SOQLSearch = (client: IDeskproClient, soql: string) =>
  installedRequest(
    client,
    `/services/data/v55.0/query/?q=${encodeURIComponent(soql)}`,
    "GET"
  );

/**
 * Get "Account" by ID
 */
export const getAccountById = (
  client: IDeskproClient,
  id: string
): Promise<Account> =>
  installedRequest(
    client,
    `/services/data/v55.0/sobjects/Account/${id}`,
    "GET"
  );

/**
 * Get "Contact" by ID
 */
export const getContactById = (
  client: IDeskproClient,
  id: string
): Promise<Contact> =>
  installedRequest(
    client,
    `/services/data/v55.0/sobjects/Contact/${id}`,
    "GET"
  );

/**
 * Get "User" by ID
 */
export const getUserById = (
  client: IDeskproClient,
  id: string
): Promise<User> =>
  installedRequest(client, `/services/data/v55.0/sobjects/User/${id}`, "GET");

/**
 * Get an sObject's metadata
 */
export const getObjectMeta = (
  client: IDeskproClient,
  object: string
): Promise<ObjectMeta> =>
  installedRequest(
    client,
    `/services/data/v55.0/sobjects/${object}/describe`,
    "GET"
  );

/**
 * Get available API versions
 */
export const getApiVersions = (client: IDeskproClient) =>
  installedRequest(client, `/services/data`, "GET");

/**
 * Get current user details
 */
export const getMe = (client: IDeskproClient) =>
  installedRequest(client, "/services/data/v55.0/chatter/users/me", "GET");

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore types do not support X-Proxy-Redirect-As-Success
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer [[oauth/global/accesstoken]]`,
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore types do not support X-Proxy-Redirect-As-Success
  if (url.startsWith("/services/data/v55.0/sobjects/") && method === "PATCH")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    options.headers["X-Proxy-Redirect-As-Success"] = 1;

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response = await fetch(
    `__salesforce_instance_url__/${trimStart(url, "")}`,
    options
  );

  if ([400, 401].includes(response.status)) {
    const refreshRequestOptions: RequestInit = {
      method: "POST",
      body: `grant_type=refresh_token&client_id=__client_key__&client_secret=__client_secret__&refresh_token=__global_access_token.json("[refreshToken]")__`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const refreshRes = await fetch(
      `__salesforce_instance_url__/services/oauth2/token`,
      refreshRequestOptions
    );
    const refreshData = await refreshRes.json();

    await client.setState<string>(
      "oauth/global/accesstoken",
      refreshData.access_token,
      {
        backend: true,
      }
    );

    options.headers = {
      ...options.headers,
      Authorization: `Bearer [[oauth/global/accesstoken]]`,
    };

    response = await fetch(
      `__salesforce_instance_url__/${trimStart(url, "")}`,
      options
    );
  }

  if (isResponseError(response)) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  return response.json();
};

export const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;
