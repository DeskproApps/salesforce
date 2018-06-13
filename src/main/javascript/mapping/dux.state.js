import {ContextPropertyList} from "../deskpro/ContextPropertyList";
import {ContextDetails} from "../deskpro/ContextDetails";
import {ContextMapping, ObjectView} from "./index";

export default function initialState()
{
  return {
    loaded: false,
    objectViews: [],
    contextMappings: []
  };
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
 * @return {Array<ContextPropertyList>}
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