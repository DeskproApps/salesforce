import { loadMappings } from '../mapping/dux'
import { query } from '../salesforce/query'

/**
 * @param {*} context
 * @param {Array<ObjectView>} objectViews
 * @param {Array<ContextMapping>} contextMappings
 * @return {Array<function>}
 */
function buildQueries(context, {objectViews, contextMappings})
{
  /**
   * @param {{}} acc
   * @param {ObjectView} view
   * @return {{}}
   */
  const reducer = function (acc, view) {
    acc[view.object.name] = query(view.object).select(view.fields);
    return acc;
  };

  const builders = objectViews.reduce(reducer, {});

  for (const mapping of contextMappings) {
    const { field, object } = mapping;
    const value = mapping.readFieldValueFromContext(context)

    const query = builders[object.name];
    query.andWhere(field, value);
  }

  return Object.keys(builders).map(key => builders[key]).map(builder => builder.asCallback())
}

export default function readRecords(context)
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {
    return dispatch(loadMappings())
      .then(mappings => buildQueries(context, mappings))
      .then(queries => Promise.all(queries.map(query => query(dpapp))))
      .then(results => {
        console.log('loading mapped objects' , results);
        return results;
      });
  }

  return thunk;
}