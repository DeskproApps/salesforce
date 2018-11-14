import {contextMappings as selectContextMappings, objectViews as selectObjectViews} from "../mapping/dux.state";

/**
 * @param {Object} [additionalState]
 * @return {{apiVersion: null, instanceUrl: null, userInfo: null, objectsLoaded: boolean, objects: Array, fields: {}}}
 */
export default function initialState(additionalState)
{
  const state = {
    apiVersion    : null,
    instanceUrl   : null,
    userInfo      : null,
    objectsLoaded : false,
    objects       : [],
    fields        : {},
    relations     : {},
  };

  return additionalState && typeof additionalState === 'object' ? { ...state, ...additionalState } : state;
}

/**
 * @param {{userInfo: {}}} state
 * @return {object|null}
 */
export function userInfo(state)
{
  const { userInfo } = state.salesforce;
  return userInfo;
}

/**
 * @param {{objectsLoaded: boolean}} state
 * @return {boolean}
 */
export function objectsLoaded(state)
{
  const { objectsLoaded } = state.salesforce;
  return objectsLoaded;
}

/**
 * @param {{apiVersionUrl: String}} state
 * @return {string}
 */
export function apiVersionUrl(state)
{
  const { apiVersion } = state.salesforce;
  if ( apiVersion ) {
    return apiVersion;
  }

  try {
    const { apiVersion: autoloaded } = state.salesforce.settings;
    return autoloaded ? autoloaded : apiVersion;
  } catch (e) {
    return apiVersion;
  }
}

/**
 * @param {{instanceUrl: String}} state
 * @return {string|undefined}
 */
export function instanceUrl(state)
{
  const { instanceUrl } = state.salesforce;
  if (instanceUrl) {
    return instanceUrl;
  }

  try {
    const { instanceUrl: autoloaded } = state.salesforce.settings;
    return autoloaded ? autoloaded : instanceUrl;
  } catch (e) {
    return instanceUrl;
  }
}

/**
 * @param {{fields: Object}} state
 * @return {Object}
 */
export function fields(state)
{
  const { fields } = state.salesforce;
  return fields;
}

/**
 * @param {{relations: Object}} state
 * @return {Object}
 */
export function relations(state)
{
  const { relations } = state.salesforce;
  return relations;
}

/**
 * @param {{objects: Array<SFObject>}} state
 * @return {Array<SFObject>}
 */
export function objects(state)
{
  const { objects } = state.salesforce;
  return [].concat(objects);
}
