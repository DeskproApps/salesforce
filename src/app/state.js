import { default as mapping, objectViews, contextMappings, editObjectView } from '../mapping/dux.state'
import { default as salesforce } from '../salesforce/dux.state'
import { default as deskpro, contextList, propertyList } from '../deskpro/dux.state'

export function getInitialState()
{
  const factories = { mapping, salesforce, deskpro };

  function reducer(acc, key) {
    acc[key] = factories[key]();
    return acc;
  }

  return Object.keys(factories).reduce(reducer, {});
}

export { contextList, propertyList }
export { objectViews, contextMappings, editObjectView }
