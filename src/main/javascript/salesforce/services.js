import { refreshAccessToken } from './security'
import {SalesforceAuthenticationError} from "./security";
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
 * @param {AppClient} dpapp
 * @param {string} url
 * @param {string} req
 * @returns {Promise<{body: Object, headers: Object, statusCode: number, status: (string)}>}
 */
function fetchRetry(dpapp, url, req)
{
  return dpapp.restApi.fetchProxy(url, req)
    .then(resp => {
      console.log('i intercepted ', resp)
      return resp;
    })
    .catch(err => {
      // retry
      if (typeof err.errorData === 'object' && [403].indexOf(err.errorData.statusCode) !== -1) {
        return refreshAccessToken(dpapp)
          .then(() => dpapp.restApi.fetchProxy(url, req))
          .catch(wrapApiError)
      }

      return Promise.reject(err);
  })
}

/**
 * @param {Error|object} err
 * @returns {Promise<never>}
 */
function wrapApiError(err)
{
    if (err instanceof SalesforceAuthenticationError) {
      return Promise.reject(err);
    }

    const wrappedError = err instanceof Error ? err : new GenericError(err, err.message || 'Salesforce API Error');

    if (typeof err.errorData === 'object' && [403].indexOf(err.errorData.statusCode) !== -1) {
      return Promise.reject(new SalesforceAuthenticationError('authentication error', wrappedError));
    }

    return Promise.reject(wrappedError);
}

/**
 * @param {AppClient} dpapp
 * @return {Promise<Object, Error>}
 */
function readUserInfo(dpapp)
{
  const req = buildReqObj({
    method: 'GET'
  });

  const url = 'https://login.salesforce.com/services/oauth2/userinfo';
  return fetchRetry(dpapp, url, req).then(resp => resp.body);
}

module.exports =
{
  readUserInfo
};
