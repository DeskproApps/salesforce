import { loadMappings } from '../mapping/dux'
import { selectQuery } from '../salesforce/query'
import { selectRecords } from '../salesforce/dux'


/**
 * @param {*} context
 * @param {Array<ObjectView>} objectViews
 * @param {Array<ContextMapping>} contextMappings
 * @return {Array<SelectQueryBuilder>}
 */
function buildQueries(context, {objectViews, contextMappings})
{
  /**
   * @param {{}} acc
   * @param {ObjectView} view
   * @return {{}}
   */
  const reducer = function (acc, view) {
    acc[view.object.name] = selectQuery(view.object).select(view.fields);
    return acc;
  };

  const builders = objectViews.reduce(reducer, {});

  for (const mapping of contextMappings) {
    const { field, object } = mapping;
    const value = mapping.readFieldValueFromContext(context);

    const query = builders[object.name];
    query.andWhere(field, value);
  }

  return Object.keys(builders).map(key => builders[key]);
}

/**
 * @param {string} name
 * @return {function(Array<ContextMapping>): ContextMapping[]}
 */
function filterMappingsByContextName (name)
{
  /**
   * @param {ContextMapping} mapping
   * @return {boolean}
   */
  function filterMappings (mapping)
  {
    return mapping.context.name === name;
  }

  /**
   * @param {Array<ContextMapping>} mappings
   * @return {ContextMapping[]}
   */

  /**
   * @param {Array<ObjectView>} objectViews
   * @param {Array<ContextMapping>} contextMappings
   * @return {{objectViews: Array<ObjectView>, contextMappings: Array<ContextMapping>}}
   */
  function handler({objectViews, contextMappings})
  {
    const mappings = contextMappings.filter(filterMappings);
    const views = [];

    if (mappings.length) {
      for(const objectView of objectViews) {
        for (const mapping of mappings) {
          if ( objectView.object.name === mapping.object.name) {
            views.push(objectView)
          }
        }
      }
      return {objectViews: views, contextMappings: mappings}
    }

    return {objectViews: [], contextMappings: []}
  }

  return handler
}

/**
 * @param {{}} contextData
 * @param {string} contextName
 * @return {function(Function, Function, AppClient): *}
 */
export default function readRecords(contextData, contextName)
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   * @return {Promise<Array<RecordSet>, Error>}
   */
  function thunk (dispatch, getState, dpapp) {

    /**
     * @param {SelectQueryBuilder} query
     * @return {Promise<RecordSet, Error>}
     */
    const runQuery = query => dispatch(selectRecords(query));

    return dispatch(loadMappings())
      .then(filterMappingsByContextName(contextName))
      .then(mappings => buildQueries(contextData, mappings))
      .then(queries => Promise.all(queries.map(runQuery)))
    ;
  }

  return thunk;
}