/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @return {Promise<Object, Error>}
 */
function readUserInfo(client)
{
  const req = { method: 'GET' };
  const url = 'https://login.salesforce.com/services/oauth2/userinfo';

  return client(url, req).then(resp => resp.body);
}

module.exports =
{
  readUserInfo
};




