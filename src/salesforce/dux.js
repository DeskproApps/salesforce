import { clientFactory } from './http';
import { getDescribeGlobal, getSObjectDescribe, getUserInfo, getQuery } from './api';
import { SFObjectField, SFObjectDescription, SFObject } from './apiObjects';
import { SObjectDescription } from './responseObjects';
import {
  fields as selFields,
  apiVersionUrl as selApiVersionUrl,
  instanceUrl as selInstanceUrl,
  objectsLoaded as selObjectsLoaded,
  objects as selObjects,
  userInfo as selectUserInfo
} from './dux.state'

import { logAndReject } from '../common/logging'
import ObjectView from "../mapping/ObjectView";
import {ContextMapping} from "../mapping";
import { RecordSet } from "./records";

const LOAD_DESCRIPTION   = 'LOAD_DESCRIPTION';
const LOAD_OBJECTS  = 'LOAD_OBJECT';
const LOAD_USER     = 'LOAD_USER';
const LOAD_SETTINGS = 'LOAD_SETTINGS';

export default function reducer(state = {}, action={})
{
  switch (action.type)
  {
    case LOAD_SETTINGS:
      const { settings } = action;
      return { ...state, settings };
    case LOAD_USER:
      const { userInfo } = action;
      return { ...state, userInfo };

    case LOAD_OBJECTS:
      const { objects } = action;
      return { ...state, objects , objectsLoaded: true };

    case LOAD_DESCRIPTION:
      const { object } = action;
      const { fields, relations } = state;
      fields[ object.name ] = [].concat(action.description.fields);
      relations[ object.name ] = [].concat(action.description.relationships);
      return {...state, fields, relations};

    default: return state;
  }
}


/**
 * @return {function(Function, Function, AppClient): Promise<Object, Error>}
 */
export function loadSettings()
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp)
  {
    return dpapp.storage.getAppStorage("salesforce")
      .catch(logAndReject('load salesforce settings error'))
      .then(settings => {
        dispatch({ type:LOAD_SETTINGS, settings });
        return settings;
      })
      ;
  }

  return thunk;
}

/**
 *
 * @param {Function} [fetchClientFactory] a custom salesforce http fetch function
 * @return {function}
 */
export function loadObjects(fetchClientFactory)
{
  /**
   * @param {DescribeGlobal} resp
   * @return {Array<SFObject>}
   */
  const toObjects = (resp) => resp.sobjects;

  /**
   * @type {function(AppClient, String, String)}
   */
  const httpClientFactory = typeof fetchClientFactory === 'function' ? fetchClientFactory : clientFactory;

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {
    const state = getState();
    if (selObjectsLoaded(state)) {
      return Promise.resolve(selObjects(state))
    }

    const client = httpClientFactory(dpapp, selInstanceUrl(state), selApiVersionUrl(state));

    return getDescribeGlobal(client)
      .then(toObjects)
      .then(objects => {
        dispatch({ type:LOAD_OBJECTS, objects });
        return [].concat(objects)
      })
      .catch(logAndReject('loadObjects error'))
  }

  return thunk;
}

/**
 * @param {SFObject} object
 * @param {Function} [fetchClientFactory] a custom salesforce http fetch function
 * @return {function}
 */
export function loadDescription(object, fetchClientFactory)
{
  /**
   * @param {SObjectDescription} response
   * @return {SFObjectDescription}
   */
  const toDescription = response => new SFObjectDescription({fields: response.fields, relations: response.childRelationships});

  /**
   * @type {function(AppClient, String, String)}
   */
  const httpClientFactory = typeof fetchClientFactory === 'function' ? fetchClientFactory : clientFactory;

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const state = getState();
    const objectFields = selFields(state)[object.name];

    if (objectFields) {
      return Promise.resolve([].concat(objectFields));
    }

    const client = httpClientFactory(dpapp, selInstanceUrl(state), selApiVersionUrl(state));

    return getSObjectDescribe(client, object)
      .then(toDescription)
      .catch(logAndReject('loadDescription error'))
      .then(description => {
        dispatch({ type:LOAD_DESCRIPTION, object, description });
        return description;
      });
  }

  return thunk;
}

/**
 * @param {Function} [fetchClientFactory] a custom salesforce http fetch function
 * @return {function}
 */
export function loadUserInfo(fetchClientFactory)
{
  /**
   * @type {function(AppClient, String, String)}
   */
  const httpClientFactory = typeof fetchClientFactory === 'function' ? fetchClientFactory : clientFactory;

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const state = getState();
    const client = httpClientFactory(dpapp, selInstanceUrl(state), selApiVersionUrl(state));

    return getUserInfo(client)
      .then(userInfo => {
        dispatch({type: LOAD_USER, userInfo});
        return userInfo
      })
      .catch(logAndReject('loadUserInfo error'))
  }

  return thunk;
}

/**
 * @param {SelectQueryBuilder} queryBuilder
 * @param {Function} [fetchClientFactory] a custom salesforce http fetch function
 * @return {function}
 */
export function selectRecords(queryBuilder, fetchClientFactory)
{
  /**
   * @type {function(AppClient, String, String)}
   */
  const httpClientFactory = typeof fetchClientFactory === 'function' ? fetchClientFactory : clientFactory;

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const state = getState();
    const client = httpClientFactory(dpapp, selInstanceUrl(state), selApiVersionUrl(state));

    /**
     * @param {String} query
     * @return {Promise<Query, Error>}
     */
    function connection(query) {
      return getQuery(client, query);
    }

    function loadRelatedObjects(relatedQueries, record) {
      return new Promise(resolve => {
        if (relatedQueries.length) {
          Promise.all(relatedQueries.map(query => {
            query.setWhere(query.where[0].props.field, record.id);
            return query.asPromise(connection);
          })).then(relatedResults => {
            record.relatedResults = relatedResults;
            resolve(record);
          });
        } else {
          resolve(record);
        }
      });
    }

    return queryBuilder.asPromise(connection)
      .then(results => {
        return new Promise(resolve => {
          Promise.all(results.records.map(record => {
            return loadRelatedObjects(queryBuilder.relatedQueries, record);
          })).then(records => {
            resolve(new RecordSet({object: results.object, records}));
          });
        });
      })
      .catch(logAndReject('loadUserInfo error'))
  }

  return thunk;
}

/**
 * @return {{type: string, userInfo: null}}
 */
export function unloadUserInfo()
{
  return {type: LOAD_USER, userInfo: null};
}
