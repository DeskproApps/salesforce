import { contextHasPropertyList } from "./predicates";
import { contextList, propertyList } from './dux.state'

export default function reducer(state = {}, action={})
{
  return state
}

/**
 * @return {function(Function, Function, AppClient): Promise<*[]>}
 */
export function loadContexts()
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   *
   * @return {Promise}
   */
  function thunk (dispatch, getState, dpapp) {
    const state = getState();
    const result = contextList(state);
    return Promise.resolve(result);
  }

  return thunk;
}

/**
 * @param {ContextDetails} context
 * @return {function}
 */
export function loadContextProperties(context)
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   *
   * @return {Promise}
   */
  function thunk (dispatch, getState, dpapp) {

    const state = getState();

    /**
     * @type {ContextPropertyList | undefined}
     */
    const list = propertyList(state).filter(contextHasPropertyList(context)).pop();
    if (list) {
      return Promise.resolve(list.properties)
    }
    return Promise.resolve([])
  }

  return thunk;
}


