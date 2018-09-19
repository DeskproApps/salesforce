import { refreshAccessToken, SalesforceAuthenticationError } from "./security";
import { GenericError } from "../errors";
import { getVersions } from "./api";

const buildReqObj = obj => {
  return Object.assign({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Accept: 'application/json',
      Authorization: `Bearer {{oauth:salesforce:access-token}}`
    },
    credentials: 'include',
    cache: 'no-cache'
  }, obj);
};

/**
 * @param {Error|object} err
 * @returns {Promise<never>}
 */
function apiError(err)
{
  if (err instanceof SalesforceAuthenticationError) {
    return Promise.reject(err);
  }

  const wrappedError = err instanceof Error ? err : new GenericError(err, err.message || 'Salesforce API Error');

  if (isErrorAuth(err)) {
    return Promise.reject(new SalesforceAuthenticationError('authentication error', wrappedError));
  }

  return Promise.reject(wrappedError);
}

/**
 * @param {*} err
 * @returns {boolean}
 */
function isErrorAuth(err)
{
  return typeof err.errorData === 'object' && [403, 401].indexOf(err.errorData.statusCode) !== -1;
}

/**
 * @param {*} err
 * @returns {boolean}
 */
function isErrorRetryable(err)
{
  return isErrorAuth(err);
}

/**
 * @param {AppClient} dpapp
 * @param {String} url
 * @param {Object} req
 * @returns {Promise<DeskproAPIResponse, Error>}
 */
function fetch (dpapp, url, req)
{
  const dpReq = buildReqObj(req);
  return dpapp.restApi.fetchProxy(url, dpReq).catch(err => {

    // retry
    if (isErrorRetryable(err)) {
      return refreshAccessToken(dpapp).then(() => dpapp.restApi.fetchProxy(url, dpReq)).catch(apiError)
    }
    return Promise.reject(err);

  });
}

/**
 * @param {AppClient} dpapp
 * @param {String} instanceUrl
 * @return {Promise<Array<ApiVersion>, Error>}
 */
export function apiVersions (dpapp, instanceUrl) {
  /**
   * @param {string} url
   * @param {object} req
   * @return {Promise<DeskproAPIResponse, Error>}
   */
  function client(url, req) {
    const reqUrl = apiUrl(url, instanceUrl);
    return fetch (dpapp, reqUrl, req)
  }

  return getVersions(client);
}

/**
 * @param {AppClient} dpapp
 * @param {String} instanceUrl
 * @param {String} apiVersion
 * @return {function(string, Object): Promise<DeskproAPIResponse, Error>}
 */
export function clientFactory (dpapp, instanceUrl, apiVersion) {

  if (!instanceUrl) {
    throw new Error('missing instance url')
  }

  if (!apiVersion) {
    throw new Error('missing api version url')
  }

  /**
   * @param {string} url
   * @param {object} req
   * @return {Promise<DeskproAPIResponse, Error>}
   */
  function client(url, req) {
    const reqUrl = apiUrl(url, instanceUrl, apiVersion);
    return fetch (dpapp, reqUrl, req)
  }
  return client;
}

/**
 * @param {string} resourceUrl
 * @param {string} instanceUrl
 * @param {string} [apiVersion] the api version number XX.X
 * @return {string}
 */
export function apiUrl(resourceUrl, instanceUrl, apiVersion)
{
  if (resourceUrl.startsWith('http://') || resourceUrl.startsWith('https://')) {
    return resourceUrl;
  }

  const isVersionUrl = -1 !== resourceUrl.indexOf('vXX.X');
  if (! apiVersion && isVersionUrl) {
    throw new Error('resource url requires a version the version is missing ')
  }

  const versionUrl = isVersionUrl ? resourceUrl.replace('vXX.X', 'v' + apiVersion) : resourceUrl;
  return encodeURI(`${instanceUrl}/services/data${versionUrl}`);
}
