export class MappableProperty
{
  /**
   * @param {String | Object} js
   * @returns {MappableProperty}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    return new MappableProperty(data)
  }

  /**
   * @param {string} label
   * @param {...*} [props]
   */
  constructor({label, ...props })
  {
    this.props = {label, ...props };
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
   * @type {string}
   */
  get label() { return this.props.label; }

  /**
   * @param {{}} object
   * @param {*}defaults
   * @return {*|null}
   */
  value(object, defaults = null)
  {
    throw new Error('value must be implemented in a subclass')
  }

  equals(other) {
    throw new Error('equals must be implemented in a subclass')
  }
}