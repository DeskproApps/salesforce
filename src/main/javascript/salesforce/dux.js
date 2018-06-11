import { fetch } from './http';
import { getDescribeGlobal, getSObjectDescribe, getReadUserInfo } from './api';
import { SFObjectField, SFObject } from './apiObjects';
import { SObjectDescription } from './responseObjects';

const LOAD_FIELDS = 'LOAD_FIELDS';
const LOAD_OBJECTS = 'LOAD_OBJECT';
const LOAD_USER = 'LOAD_USER';

export default function reducer(state = {}, action={})
{
  switch (action.type)
  {
    case LOAD_USER:
      const { user } = action;
      return { ...state, user };

    case LOAD_OBJECTS:
      const { objects } = action;
      return { ...state, objects, objectsLoaded: true };

    case LOAD_FIELDS:
      const { object } = action;
      const { fields } = state;
      fields[ object.name ] = [].concat(action.fields);
      return {...state, fields};

    default: return state;
  }
}

/**
 * @return {function}
 */
export function loadObjects()
{
  /**
   * @param {DescribeGlobal} resp
   * @return {Array<SFObject>}
   */
  const toObjects = (resp) => resp.sobjects;

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const { salesforce } = getState();

    if (salesforce.objectsLoaded) {
      return Promise.resolve([].concat(salesforce.objects))
    }

    return fetch(dpapp, getDescribeGlobal).then(toObjects)
      .then(objects => {
        dispatch({ type:LOAD_OBJECTS, objects });
        return [].concat(objects)
      })
  }

  return thunk;
}

/**
 * @param {SFObject} object
 * @return {function}
 */
export function loadFields(object)
{
  /**
   * @param {SObjectDescription} response
   * @return {Array<SFObjectField>}
   */
  const toFields = response => response.fields;

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const { fields } = getState().salesforce;
    const objectFields = fields[object.name];

    if (objectFields) {
      return Promise.resolve([].concat(objectFields));
    }

    return fetch(dpapp, (client) => getSObjectDescribe(client, object)).then(toFields)
      .then(fields => {
        dispatch({ type:LOAD_FIELDS, object, fields });
        return fields;
      })
  }

  return thunk;
}

/**
 * @return {function}
 */
export function readUserInfo()
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const { user } = getState().salesforce;
    if (user) {
      return Promise.resolve(user)
    }

    return fetch(dpapp, getReadUserInfo).then(userInfo => {
      dispatch({type: LOAD_USER, userInfo});
      return userInfo
    }).catch (err => {
      dispatch({type: LOAD_USER, userInfo: null});
      return Promise.reject(err)
    })
  }

  return thunk;
}