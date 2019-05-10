import { clientFactory } from './http'
import { getQuery } from './api'
import { Record, RecordSet} from "./records";
import { Value } from "./Value";

import { SFObject, SFObjectField } from "./apiObjects";
import {FieldValue} from "./FieldValue";

const ID = 'Id';

/**
 * @param {Projection} queryProjection
 * @param {SFObject} type
 * @param {Array<SFObjectField>} fields
 * @return {Record}
 */
function toRecord(queryProjection, type, fields)
{
  if (fields[0].name.match(/\./)) {
    const object = fields[0].name.split('.')[0];
    const values = fields
      .filter(field => !!field.type)
      .map(field => {
        const [ object, fieldName ] = field.name.split('.');
        return new FieldValue({ field, value: queryProjection.fields[object][fieldName] })
      });
    const id = queryProjection.fields[object][ID];
    const referencedType = new SFObject({name: object, label: object});
    /**
     * @type {string}
     */
    return new Record({ id, type: referencedType, values, relatedResults: [] })
  }
  const values = fields.map(field => new FieldValue({ field, value: queryProjection.fields[field.name] }));
  /**
   * @type {string}
   */
  const id = queryProjection.fields[ID];
  return new Record({ id, type, values, relatedResults: [] })
}

/**
 * @param {Query} query
 * @param {SFObject} object
 * @param {Array<SFObjectField>} fields
 * @return {RecordSet}
 */
function toRecordSet(query, object, fields)
{
  const records = query.records.map(projection => toRecord(projection, object, fields));
  return new RecordSet({ object, records });
}

/**
 * @param {SFObjectField} field
 * @param {Value} value
 * @return {string}
 */
function coerce(field, value)
{
  if (field.type === SFObjectField.TYPE_BOOL) {
    return value.asBoolean() ? 'TRUE' : 'FALSE'
  }

  if (field.type === SFObjectField.TYPE_INT) {
    return value.asInteger().toString()
  }

  if (field.type === SFObjectField.TYPE_DOUBLE) {
    //TODO should do precision ?
    return value.asFloat().toString();
  }

  return "'" + value.asString() + "'";
}

class Expression
{
  /**
   * @param {SFObjectField} field
   * @param {Value} value
   */
  constructor({field, value})
  {
    this.props = {field, value}
  }

  toSOQLString()
  {
    const {field, value} = this.props;
    const soqlValue = coerce(field, value);
    return `${field.name} = ${soqlValue}`;
  }
}

class SelectQueryBuilder
{
  /**
   * @param {SFObject} from
   */
  constructor({ from })
  {
    this.props = {
      from: from,
      fields: [],
      where: [],
      relatedQueries: [],
    }
  }

  /**
   * @param {Array<SFObjectField>} fields
   * @return {SelectQueryBuilder}
   */
  select(fields)
  {
    this.props.fields = fields;
    return this;
  }

  /**
   * @param {SFObjectField} field
   * @param {*} value
   * @return {SelectQueryBuilder}
   */
  andWhere(field, value)
  {
    this.props.where.push(
      new Expression({field, value: new Value(value)})
    );

    return this;
  }

  /**
   * @param {SFObjectField} field
   * @param {*} value
   * @return {SelectQueryBuilder}
   */
  setWhere(field, value)
  {
    this.props.where = [
      new Expression({field, value: new Value(value)})
    ];

    return this;
  }

  /**
   * @return {string}
   */
  asString()
  {
    const toFieldName = (field) => field.name;
    const toSOQLString = (expr) => expr.toSOQLString();

    const {  where, fields, from } = this.props;
    const fieldNames = fields.filter(field => field.name !== ID).map(toFieldName);

    const selectExpr = [ID].concat(fieldNames).join(', ');
    const fromExpr = `FROM ${from.name}`;

    if (where.length) {
      const whereExpr = where.length ? 'WHERE ' + where.map(toSOQLString).join(' AND ') : '';
      return `SELECT ${selectExpr} ${fromExpr} ${whereExpr}`;
    }

    return `SELECT ${selectExpr} ${fromExpr}`;
  }

  /**
   * @return {function(function(string): Promise): Promise<RecordSet>}
   */

  /**
   * @param {function(string): Promise<Query, Error>} connection
   * @return {Promise<RecordSet>}
   */
  asPromise(connection)
  {
    const query = this.asString();
    const { from, fields } = this.props;
    const parseQuery = query => toRecordSet(query, from, fields);

    return connection(query).then(parseQuery);
  }


  get relatedQueries() {
    return this.props.relatedQueries;
  }

  set relatedQueries(queries) {
    this.props.relatedQueries = queries;
    return this;
  }

  get where() {
    return this.props.where;
  }

  set where(where) {
    this.props.where = where;
    return this;
  }

}

/**
 * @param {SFObject} from
 * @return {SelectQueryBuilder}
 */
export function selectQuery (from)
{
  return new SelectQueryBuilder({ from });
}
