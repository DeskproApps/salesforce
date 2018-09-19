import {SFObjectField} from "./apiObjects";

export class FieldValue
{
  /**
   * @param {SFObjectField} field
   * @param {Value} value
   */
  constructor({field, value})
  {
    this.props = {field, value };
  }

  /**
   * @return {SFObjectField}
   */
  get field() { return this.props.field }

  /**
   * @return {*}
   */
  get value() { return this.props.value }

  /**
   * @param {String} type
   * @return {boolean}
   */
  hasFieldType(type) {
    return type === this.props.field.type
  }

  /**
   * @return {string}
   */
  asString() { return this.props.value }

  /**
   * @return {Number}
   */
  asInteger() { return parseInt(this.props.value, 10); }

  /**
   * @return {Number}
   */
  asFloat() { return parseFloat(this.props.value); }

  /**
   * @return {Boolean}
   */
  asBoolean() { return !!this.props.value; }
}
