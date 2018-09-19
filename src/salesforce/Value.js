export class Value
{
  /**
   * @param {*} value
   */
  constructor(value)
  {
    this.value = value;
  }

  /**
   * @return {string}
   */
  asString() { return this.value.toString() }

  /**
   * @return {Number}
   */
  asInteger() { return parseInt(this.value, 10); }

  /**
   * @return {Number}
   */
  asFloat() { return parseFloat(this.value); }

  /**
   * @return {Boolean}
   */
  asBoolean() { return !!this.value; }
}