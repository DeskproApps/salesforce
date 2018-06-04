const CHANGED = 'MAPPING_CHANGED';

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
 * @param {ObjectView} newObjectView
 * @param {Array<ContextMapping>}  newContextMappings
 * @return {function}
 */
export function addMapping(newObjectView, newContextMappings)
{
  console.log('add Mapping called ', newObjectView, newContextMappings);

  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const { objectViews, contextMappings } = getState().mappings;
    const mappings = { objectViews: objectViews.concat([newObjectView]), contextMappings: contextMappings.concat(newContextMappings) }

    console.log("hububub ", JSON.stringify(mappings));
    return Promise.resolve(
      dispatch({ type: CHANGED, ...mappings })
    );

  }

  return thunk;
}