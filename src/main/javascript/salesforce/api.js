import {DescribeGlobal, SObjectDescription} from './models'

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

/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @return {Promise<DescribeGlobal, Error>}
 */
function getDescribeGlobal(client)
{
  const req = { method: 'GET' };
  const url = 'https://eu8.salesforce.com/services/data/v37.0/sobjects';

  return client(url, req).then(resp => DescribeGlobal.instance(resp.body));
}

/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @param {string|SFObject} object
 * @return {Promise<SObjectDescription, Error>}
 * @returns {*}
 */
function getSObjectDescribe(client, object)
{
  const name = typeof object === "string" ? object : object.name

  const req = { method: 'GET' };
  const url = `https://eu8.salesforce.com/services/data/v37.0/sobjects/${name}/describe`;

  return client(url, req).then(resp => SObjectDescription.instance(resp.body));
}

module.exports =
{
  readUserInfo,

  getDescribeGlobal,

  getSObjectDescribe
};




