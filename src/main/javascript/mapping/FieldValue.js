import {SFObject, SFObjectField} from "../salesforce/apiObjects";



export class FieldValue
{
  /**
   * @param {SFObjectField} field
   * @param {*} value
   * @param {...*} [props]
   */
  constructor({object: field, value, ...props })
  {
    this.props = {field, value, ...props };
  }

  toJSON = () => {
    return JSON.parse(JSON.stringify(this.props));
  };

  /**
   * Returns a deep clone of this object
   *
   * @method
   * @return {Object}
   */
  toJS = () => this.toJSON();

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