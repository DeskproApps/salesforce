/**
 * @return {{apiVersion: string, instanceUrl: string, userInfo: null, objectsLoaded: boolean, objects: Array, fields: {}}}
 */
export default function initialState()
{
  return {
    apiVersion: "v37.0",
    instanceUrl: "https://eu8.salesforce.com",
    userInfo: null,
    objectsLoaded: false,
    objects: [],
    fields: {}
  }
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
 * @param {{apiVersion: String}} state
 * @return {string}
 */
export function apiVersion(state)
{
  const { apiVersion } = state.salesforce;
  return apiVersion;
}

/**
 * @param {{instanceUrl: String}} state
 * @return {string}
 */
export function instanceUrl(state)
{
  const { instanceUrl } = state.salesforce;
  return instanceUrl;
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
 * @param {{objects: Array<SFObject>}} state
 * @return {Array<SFObject>}
 */
export function objects(state)
{
  const { objects } = state.salesforce;
  return [].concat(objects);
}