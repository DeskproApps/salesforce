import {DescribeGlobal, SObjectDescription, Query} from './responseObjects'
import {UserInfo} from './apiObjects'

/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @return {Promise<UserInfo, Error>}
 */
function getReadUserInfo(client)
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

/**
 * @param {function(string, object): Promise<Object, Error>} client
 * @param {string} query
 * @return {Promise<Query, Error>}
 */
function query(client, query)
{
  const req = { method: 'GET' };
  const url = encodeURI(`https://eu8.salesforce.com/services/data/v37.0/query?q=${query}`);

  return client(url, req).then(resp => Query.instance(resp.body));
}

module.exports =
{
  getReadUserInfo,

  getDescribeGlobal,

  getSObjectDescribe
};




