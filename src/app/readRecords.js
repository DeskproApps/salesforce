import { loadMappings } from '../mapping/dux'
import { selectQuery } from '../salesforce/query'
import { selectRecords } from '../salesforce/dux'
import { SFObject, SFObjectField } from "../salesforce/apiObjects";


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
    acc[view.object.name].relatedQueries = [];
    if (view.relatedObjects) {
      acc[view.object.name].relatedQueries = view.relatedObjects.map(relatedObject => {
        const object = SFObject.instance({label: relatedObject.name, name: relatedObject.name});
        const query = selectQuery(object).select(relatedObject.fields);
        const foreignField = SFObjectField.instance({label: relatedObject.foreignField, name: relatedObject.foreignField});
        return query.andWhere(foreignField, '%%ID%%')
      });
    }
    if (view.referencedObjects) {
      const referenceQueries = view.referencedObjects.map(referencedObject => {
        referencedObject.fields.forEach(field => field.name = `${referencedObject.relationshipName}.${field.name}`);
        const foreignId = `${referencedObject.relationshipName}.Id`;
        referencedObject.fields.push(SFObjectField.instance({label: foreignId, name: foreignId}));
        const query = selectQuery(view.object).select(referencedObject.fields);
        const foreignField = SFObjectField.instance({label: "ID", name: "ID"});
        return query.andWhere(foreignField, '%%ID%%')
      });
      acc[view.object.name].relatedQueries = acc[view.object.name].relatedQueries.concat(referenceQueries);
    }
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
 * @param {string} objectType
 * @return {function(Array<ContextMapping>): ContextMapping[]}
 */
function filterMappingsByContextObject (objectType)
{
  /**
   * @param {ContextMapping} mapping
   * @return {boolean}
   */
  function filterMappings (mapping)
  {
    return mapping.context.name === objectType;
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
 * @param {{}} objectProperties the properties of a Deskpro Object
 * @param {string} objectType the type of the Deskpro Object which the properties belong to
 * @return {function(Function, Function, AppClient): *}
 */
export default function readRecords(objectProperties, objectType)
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
      .then(filterMappingsByContextObject(objectType))
      .then(mappings => buildQueries(objectProperties, mappings))
      .then(queries => Promise.all(queries.map(runQuery)))
    ;
  }

  return thunk;
}
