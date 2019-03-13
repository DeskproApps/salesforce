import {ContextMapping, ObjectView} from "./index";

/**
 * @param {Object}  [additionalState]
 * @return {{loaded: boolean, objectViews: Array, contextMappings: Array}}
 */
export default function initialState(additionalState)
{
  const state = {
    loaded: false,
    objectViews: [],
    contextMappings: [],
    editObjectView: null
  };

  return additionalState && typeof additionalState === 'object' ? { ...state, ...additionalState } : state;
}

/**
 * @param {Object} state
 * @return {Array<ContextDetails>}
 */
export function editObjectView(state)
{
  return state.mapping.editObjectView;
}

/**
 * @param {Object} state
 * @return {Array<ContextDetails>}
 */
export function objectViews(state)
{
  const { objectViews } = state.mapping;
  return objectViews.map(o => JSON.stringify(o)).map(ObjectView.instance)
}

/**
 * @param {Object} state
 * @return {Array<ContextMapping>}
 */
export function contextMappings(state)
{
  const { contextMappings } = state.mapping;
  return contextMappings.map(o => JSON.stringify(o)).map(ContextMapping.instance)
}

/**
 * @param {Object} state
 * @return {Boolean}
 */
export function loaded(state)
{
  const { loaded } = state.mapping;
  return loaded
}
