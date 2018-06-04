export class ContextProperty
{
  /**
   * @param {String | Object} js
   * @returns {ContextProperty}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    return new ContextProperty(data)
  }

  /**
   * @param {string} name
   * @param {string} label
   * @param {...*} [props]
   */
  constructor({name, label, ...props })
  {
    this.props = {name, label, ...props };
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
  get name() { return this.props.name; }

  /**
   * @type {string}
   */
  get label() { return this.props.label; }
}