export class ContextDetails
{
  /**
   * @param {String | Object} js
   * @returns {ContextDetails}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    return new ContextDetails(data)
  }

  /**
   * @param {String} name
   * @param {String} label
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