import {ContextMapping} from "./index";

const CHANGED = 'MAPPING_CHANGED';
const LOADED = 'MAPPING_LOADED';
import { hasMapping, hasView } from './predicates'
import ObjectView from "./ObjectView";

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

export function loadMappings()
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp)
  {
    const { objectViews, contextMappings, loaded } = getState().mappings;
    if (loaded) {
      return Promise.resolve({ objectViews, contextMappings });
    }

    return dpapp.storage.getAppStorage("mappings")
      .then(mappings => {
        return mappings || { objectViews : [], contextMappings: [] }
      })
      .then(({objectViews, contextMappings}) => ({
        objectViews: objectViews.map(ObjectView.instance),
        contextMappings: contextMappings.map(ContextMapping.instance)
      }))
      .then(mappings => {
        dispatch({ type:LOADED, ...mappings });
        return Promise.resolve(JSON.parse(JSON.stringify(mappings)))
      })
    ;
  }

  return thunk;
}

/**
 * @param {SFObject} object
 * @return {function}
 */
export function removeMappings(object)
{
  console.log("removeMappings dux ", object);

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {
    const { objectViews, contextMappings } = getState().mappings;

    const mappings = {
      objectViews: objectViews.filter(view => !hasView(object, view)),
      contextMappings: contextMappings.filter(mapping => !hasMapping(object, mapping))
    };

    dispatch({ type: CHANGED, ...mappings });

    console.log("removeMappings ", JSON.stringify(mappings));
    return Promise.resolve(mappings);
  }
  return thunk
}

/**
 * @param {SFObject} object
 * @param {ObjectView} newObjectView
 * @param {Array<ContextMapping>}  newContextMappings
 * @return {function}
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
    const { objectViews, contextMappings } = getState().mappings;

    const mappings = {
      objectViews: objectViews.map(oldView => replaceView(newObjectView, oldView)),
      contextMappings: contextMappings.filter(mapping => !hasMapping(object, mapping)).concat(newContextMappings)
    };

    dispatch({ type: CHANGED, ...mappings });

    console.log("hububub ", JSON.stringify(mappings));
    return Promise.resolve(mappings);
  }

  return thunk;
}

/**
 * @param {SFObject} object
 * @param {ObjectView} newObjectView
 * @param {Array<ContextMapping>}  newContextMappings
 * @return {function}
 */
export function addMappings(object, newObjectView, newContextMappings)
{
  console.log('add Mapping called ', newObjectView, newContextMappings);

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const { objectViews, contextMappings } = getState().mappings;
    const mappings = {
      objectViews: objectViews.concat([newObjectView]),
      contextMappings: contextMappings.concat(newContextMappings)
    };

    dispatch({ type: CHANGED, ...mappings });

    console.log("hububub ", JSON.stringify(mappings));
    return Promise.resolve(mappings);
  }

  return thunk;
}

/**
 * @return {function}
 */
export function persistMappings()
{
  console.log('persist mappings ');

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const { objectViews, contextMappings } = getState().mappings;
    const mappings = { objectViews, contextMappings };

    return dpapp.storage.setAppStorage("mappings", mappings);
  }

  return thunk;
}
