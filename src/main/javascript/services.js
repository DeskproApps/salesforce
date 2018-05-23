let authToken = null;

const buildReqObj = obj => {
  return Object.assign({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Accept: 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    credentials: 'include',
    cache: 'no-cache'
  }, obj);
};

/**
 * @param {DeskproAPIClient} restApi
 * @return {Promise<Object, Error>}
 */
function readUserInfo({ restApi })
{
  const req = buildReqObj({
    method: 'GET'
  });

  return restApi.fetchProxy('https://login.salesforce.com/services/oauth2/userinfo', req);
}

function tryAndSetAuthToken(source, sourceType)
{
  if (sourceType === 'user_settings' &&  source && source.access_token) {
    authToken = source.access_token;
    return true;
  }

  if (sourceType === 'oauth2_response' &&  source && source.access_token) {
    authToken = source.access_token;
    return true;
  }

  return false;
}

/**
 *
 * @param {OauthFacade} oauth
 * @return {Promise<Object, Error>}
 */
function fetchAccessToken({ oauth })
{
  const query = { scope: 'api refresh_token' };
  return oauth.requestAccess('salesforce', { query });
}

/**
 * @param resp
 * @param {StorageApiFacade} storage
 * @return {Promise}
 */
function storeAccessToken(resp, { storage })
{
  tryAndSetAuthToken(resp, 'oauth2_response');
  return storage.setAppStorage('user_settings', { ...resp })
}

module.exports =
{
  fetchAccessToken,

  tryAndSetAuthToken,

  storeAccessToken,

  readUserInfo
};
