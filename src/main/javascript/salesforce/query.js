import { fetch } from './http'
import { getQuery } from './api'
import { Record, RecordSet} from "./records";
import { Value } from "./Value";

import {SFObjectField} from "./apiObjects";
import {FieldValue} from "./FieldValue";

const ID = 'Id';

/**
 * @param {QueryProjection} queryProjection
 * @param {SFObject} type
 * @param {Array<SFObjectField>} fields
 * @return {Record}
 */
function toRecord(queryProjection, type, fields)
{
  const values = fields.map(field => new FieldValue({ field, value: queryProjection.fields[field.name] }));
  /**
   * @type {string}
   */
  const id = queryProjection.fields[ID];
  return new Record({ id, type, values })
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
      where: []
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
   * @return {string}
   */
  asString()
  {
    const toFieldName = (field) => field.name;
    const toSOQLString = (expr) => expr.toSOQLString();

    const fieldNames = this.props.fields.filter(field => field.name !== ID).map(toFieldName);

    const selectExpr = [ID].concat(fieldNames).join(', ');
    const fromExpr = `${this.props.from.name}`;
    const whereExpr = this.props.where.map(toSOQLString).join(' AND ');

    return `SELECT ${selectExpr} FROM ${fromExpr} WHERE ${whereExpr}`;
  }

  /**
   * @return {function(*=): Promise<Record>}
   */
  asCallback()
  {
    const query = this.asString();
    const { from, fields } = this.props;
    const parseQuery = query => toRecordSet(query, from, fields);

    /**
     * @param {AppClient} dpapp
     */
    return function callback(dpapp) {
      return fetch(dpapp, (client) => getQuery(client, query)).then(parseQuery)
    }
  }
}

/**
 * @param {SFObject} from
 * @return {SelectQueryBuilder}
 */
export function query (from)
{
  return new SelectQueryBuilder({ from });
}