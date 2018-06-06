const CHANGED = 'MAPPING_CHANGED';
import { hasMapping, hasView } from './predicates'

export default function reducer(state = {}, action={})
{
  switch (action.type)
  {
    case CHANGED:
      const { objectViews, contextMappings } = action;
      return {...state, objectViews, contextMappings};

    default: return state;
  }
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
    console.log("removeMappings ", JSON.stringify(mappings));
    return Promise.resolve(
      dispatch({ type: CHANGED, ...mappings })
    );
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

    console.log("hububub ", JSON.stringify(mappings));
    return Promise.resolve(
      dispatch({ type: CHANGED, ...mappings })
    );
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

    console.log("hububub ", JSON.stringify(mappings));
    return Promise.resolve(
      dispatch({ type: CHANGED, ...mappings })
    );

  }

  return thunk;
}
