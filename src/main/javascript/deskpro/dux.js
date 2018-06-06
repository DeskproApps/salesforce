import { hasPropertyList } from "./services";

export default function reducer(state = {}, action={})
{
  return state
}

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
    const { contextList } = getState().deskpro;
    return Promise.resolve([].concat(contextList));
  }

  return thunk;
}

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
    const { propertyList } = getState().deskpro;

    /**
     * @type {ContextPropertyList | undefined}
     */
    const list = propertyList.filter(list => hasPropertyList(context, list)).pop();
    if (list) {
      return Promise.resolve(list.properties)
    }
    return Promise.resolve([])
  }

  return thunk;
}


