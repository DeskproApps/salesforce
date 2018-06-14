import {DescribeGlobal, SObjectDescription, Query} from './responseObjects'
import {UserInfo, ApiVersion} from './apiObjects'

/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @return {Promise<Array<Version>, Error>}
 */
function getVersions(client)
{
  const req = { method: 'GET' };
  const url = '/';

  return client(url, req).then(resp => resp.body.map(ApiVersion.instance));
}

/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @return {Promise<UserInfo, Error>}
 */
function getUserInfo(client)
{
  const req = { method: 'GET' };
  const url = 'https://login.salesforce.com/services/oauth2/userinfo';

  return client(url, req).then(resp => UserInfo.instance(resp.body));
}

/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @return {Promise<DescribeGlobal, Error>}
 */
function getDescribeGlobal(client)
{
  const req = { method: 'GET' };
  const url = '/vXX.X/sobjects';

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
  const url = `/vXX.X/sobjects/${name}/describe`;

  return client(url, req).then(resp => SObjectDescription.instance(resp.body));
}

/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @param {string} query
 * @return {Promise<Query, Error>}
 */
function getQuery(client, query)
{
  const req = { method: 'GET' };
  const url = `/vXX.X/query?q=${query}`;

  return client(url, req).then(resp => Query.instance(resp.body));
}

module.exports =
{
  getVersions,

  getUserInfo,

  getDescribeGlobal,

  getSObjectDescribe,

  getQuery
};




