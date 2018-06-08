/**
 * @param {SFObjectField} field
 * @return {string}
 */
import {SFObjectField} from "./apiObjects";

const toFieldName = (field) => field.name;

/**
 * @param {FieldValue}  field
 * @return {boolean}
 */
const isEmpty = (field) => field.value === undefined || field.value === null;

/**
 * @param {FieldValue} value
 * @return {string}
 */
const soqlValue = (value) => {

  if (value.hasFieldType(SFObjectField.TYPE_BOOL)) {
    return value.asBoolean() ? 'TRUE' : 'FALSE'
  }

  if (value.hasFieldType(SFObjectField.TYPE_INT)) {
    return value.asInteger().toString()
  }

  if (value.hasFieldType(SFObjectField.TYPE_DOUBLE)) {
    //TODO should do precision ?
    return value.asFloat().toString();
  }

  return "'" + value.asString() + "'";
};

/**
 * @param {FieldValue} fieldValue
 * @return {string}
 */
const toWhereClause = (fieldValue) => {

  const name = fieldValue.field.name;
  const value = soqlValue(fieldValue);

  return `${name} = ${value}`;
} ;

/**
 * @param {ObjectView} select
 * @param {{fields: Array<FieldValue>}} where
 * @return {string}
 */
export function buildQuery(select, where)
{
  if (where.fields.length === 0) {
    throw new Error('Where values list can not be empty')
  }

  const fields = where.fields.filter(field => !isEmpty(field));
  if (fields.length !== where.fields.length) {
    throw new Error('Some where values where empty')
  }

  const selectExpr = select.fields.map(toFieldName).join(', ');
  const fromExpr = `${select.object.name}`;
  const whereExpr = where.fields.map(toWhereClause).join(' AND ');

  return `SELECT  ${selectExpr} FROM ${fromExpr} WHERE ${whereExpr}`;
}

