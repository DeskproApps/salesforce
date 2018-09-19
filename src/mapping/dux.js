import { ContextMapping } from "./index";
import { hasMapping, hasView } from './predicates'
import ObjectView from "./ObjectView";
import { contextMappings as selectContextMappings, objectViews as selectObjectViews, loaded as selectLoaded } from './dux.state'
import { logAndReject } from '../common/logging'

const CHANGED = 'MAPPING_CHANGED';
const LOADED = 'MAPPING_LOADED';

export default function reducer(state = {}, action={})
{
  switch (action.type)
  {
    case LOADED: {
      const { objectViews, contextMappings } = action;
      return {...state, objectViews, contextMappings, loaded: true};
    }
    case CHANGED: {
      const { objectViews, contextMappings } = action;
      return {...state, objectViews, contextMappings};
    }

    default: return state;
  }
}

/**
 * @return {function(Function, Function, AppClient): Promise<Object, Error>}
 */
export function loadMappings()
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp)
  {
    const state = getState();
    const objectViews     = selectObjectViews(state);
    const contextMappings = selectContextMappings(state);
    const loaded     = selectLoaded(state);

    if (loaded) {
      return Promise.resolve({ objectViews, contextMappings });
    }

    return dispatch(hydrateMappings());
  }

  return thunk;
}

/**
 * @param {SFObject} object
 * @return {function(Function, Function, AppClient): Promise<Object, Error>}
 */
export function removeMappings(object)
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {
    const state = getState();

    const mappings = {
      objectViews: selectObjectViews(state).filter(view => !hasView(object, view)),
      contextMappings: selectContextMappings(state).filter(mapping => !hasMapping(object, mapping))
    };

    dispatch({ type: CHANGED, ...mappings });
    return Promise.resolve(mappings);
  }
  return thunk
}

/**
 * @param {SFObject} object
 * @param {ObjectView} newObjectView
 * @param {Array<ContextMapping>}  newContextMappings
 * @return {function(Function, Function, AppClient): Promise<Object, Error>}
 */
export function replaceMappings(object, newObjectView, newContextMappings)
{
  /**
   * @param {ObjectView} newView
   * @param {ObjectView} oldView
   * @return {ObjectView}
   */
  function replaceView (newView, oldView)
  {
    if (newView.object.name === oldView.object.name) {
      return newView
    }
    return oldView;
  }

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {
    const state = getState();

    const mappings = {
      objectViews: selectObjectViews(state).map(oldView => replaceView(newObjectView, oldView)),
      contextMappings: selectContextMappings(state).filter(mapping => !hasMapping(object, mapping)).concat(newContextMappings)
    };

    dispatch({ type: CHANGED, ...mappings });
    return Promise.resolve(mappings);
  }

  return thunk;
}

/**
 * @param {SFObject} object
 * @param {ObjectView} newObjectView
 * @param {Array<ContextMapping>}  newContextMappings
 * @return {function(Function, Function, AppClient): Promise<Object, Error>}
 */
export function addMappings(object, newObjectView, newContextMappings)
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp)
  {
    const state = getState();
    const mappings = {
      objectViews: selectObjectViews(state).concat([newObjectView]),
      contextMappings: selectContextMappings(state).concat(newContextMappings)
    };

    dispatch({ type: CHANGED, ...mappings });
    return Promise.resolve(mappings);
  }

  return thunk;
}

/**
 * @return {function(Function, Function, AppClient): Promise<Object, Error>}
 */
export function persistMappings()
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp)
  {
    const state = getState();
    const mappings = {
      objectViews: selectObjectViews(state),
      contextMappings: selectContextMappings(state)
    };
    return dpapp.storage.setAppStorage("mappings", mappings).catch(logAndReject('persistMappings error'));
  }

  return thunk;
}

/**
 * @return {function(Function, Function, AppClient): Promise<Object, Error>}
 */
export function hydrateMappings()
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp)
  {
    return dpapp.storage.getAppStorage("mappings")
      .then(mappings => {
        return mappings || { objectViews : [], contextMappings: [] }
      })
      .then(({objectViews, contextMappings}) => ({
        objectViews: objectViews.map(ObjectView.instance),
        contextMappings: contextMappings.map(ContextMapping.instance)
      }))
      .catch(logAndReject('hydrateMappings error'))
      .then(mappings => {
        dispatch({ type:LOADED, ...mappings });
        return JSON.parse(JSON.stringify(mappings));
      })
      ;
  }

  return thunk;
}
