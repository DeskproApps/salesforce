import {refreshAccessToken, SalesforceAuthenticationError} from "./security";
import {GenericError} from "../errors";

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
  return typeof err.errorData === 'object' && [403].indexOf(err.errorData.statusCode) !== -1;
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
 * @returns {function(string, object): Promise<DeskproAPIResponse, Error>}
 */
const apiClient = (dpapp) => (url, req) => {
  const dpReq = buildReqObj(req);
  return dpapp.restApi.fetchProxy(url, dpReq);
};

/**
 * @param {AppClient} dpapp
 * @param {function(*=, *=): Promise<DeskproAPIResponse>} request
 * @returns {Promise<DeskproAPIResponse, Error>}
 */
const fetch = (dpapp, request) => {
    const client = apiClient(dpapp);
    return request(client).catch(err => {
        // retry
        if (isErrorRetryable(err)) {
          return refreshAccessToken(dpapp).then(() => request(client)).catch(apiError)
        }
        return Promise.reject(err);
      })
    ;
};

module.exports =
{
  fetch
};