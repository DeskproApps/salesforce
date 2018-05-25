import ErrorWrapper from 'error-wrapper';
import { GenericError } from '../errors';

class SalesforceAuthenticationError extends ErrorWrapper
{
  static displayName = 'SalesforceAuthenticationError'; // optional. survives minification

  constructor (message, childError)
  {
    super(message, childError);
  }
}

const oauthProviderName = 'salesforce';
const oauthAccessTokenStorage = 'oauth:salesforce:access-token';
const oauthTokenStorage = 'oauth:salesforce:token';

/**
 * Builds a connection object using the application settings
 *
 * @param {string} urlRedirect
 * @param {string} consumerKey
 * @param {string} consumerSecret
 * @returns {{providerName: string, urlRedirect: *, clientId: *, clientSecret: *, urlAuthorize: string, urlAccessToken: string, scopes: string[]}}
 */
function oauthConnectionFactory ({ urlRedirect, consumerKey, consumerSecret })
{
  return {
    providerName: oauthProviderName,
    urlRedirect,
    clientId:       consumerKey,
    clientSecret:   consumerSecret,
    urlAuthorize:   'https://login.salesforce.com/services/oauth2/authorize',
    urlAccessToken: 'https://login.salesforce.com/services/oauth2/token',
    scopes:         ['api', 'refresh_token']
  }
}

/**
 *
 * @param {AppClient} dpapp
 * @return {Promise<Object, Error>}
 */
function fetchAccessToken (dpapp)
{
  const query = { scope: 'api refresh_token' };
  return dpapp.oauth.requestAccess(oauthProviderName, { query }).catch(err => {
      const errorMsg = 'oauth2 error';
      const sourceError = err instanceof Error ? err: new GenericError(err, 'rejected promise');

      return Promise.reject(new SalesforceAuthenticationError(errorMsg, sourceError))
    });
}

/**
 * @param resp
 * @param {AppClient} dpapp
 * @return {Promise}
 */
function storeAuthTokens(resp, dpapp)
  {
    const accessToken = resp.access_token;

    return dpapp.storage.setAppStorage([
      [oauthAccessTokenStorage, accessToken],
      [oauthTokenStorage, resp]
    ]).then(() => resp)
}

/**
 * @param {AppClient} dpapp
 * @param {Object} props
 * @return {Promise<string, SalesforceAuthenticationError>}
 */
function establishConnection(dpapp, props)
{
  return dpapp.oauth.register(oauthProviderName, props)
    .then(connectionProps => fetchAccessToken(dpapp))
    .then(resp => storeAuthTokens(resp, dpapp))
    .catch(err => {
      if (err instanceof SalesforceAuthenticationError) {
        return Promise.reject(err)
      }

      const errorMsg = err instanceof Error ? err.message || 'oauth2 error' : 'oauth2 error';
      const sourceError = err instanceof Error ? err: new GenericError(err, 'rejected promise');

      return Promise.reject(new SalesforceAuthenticationError(errorMsg, sourceError))
    });
}

/**
 * @param {AppClient} dpapp
 * @return {Promise<{string}, SalesforceAuthenticationError>}
 */
function refreshAccessToken(dpapp)
{
  const query = { refresh_token: oauthTokenStorage }
  return dpapp.oauth.refreshAccess(oauthProviderName, { query })
    .then(resp => storeAuthTokens(resp, dpapp))
    .catch(err => {
      // TODO should wrap in specific error
      return Promise.reject(err);
    })
}

export { SalesforceAuthenticationError, establishConnection, refreshAccessToken, fetchAccessToken, storeAuthTokens, oauthProviderName, oauthConnectionFactory }