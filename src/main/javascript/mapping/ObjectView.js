export default class ObjectView
{
  /**
   * @param {SFObject} object
   * @param {Array<SFObjectField>} label
   * @param {...*} [props]
   */
  constructor({object, fields, ...props })
  {
    this.props = {object, fields, ...props };
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
   * @return {SFObject}
   */
  get object() { return this.props.object }

  /**
   * @return {Array<SFObjectField>}
   */
  get fields() { return this.props.fields }
}