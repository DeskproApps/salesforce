export default class RouteDefinition
{
  /**
   *
   * @param {string} path
   * @param {string} label
   * @param {...*} [props]
   */
  constructor({path, label, ...props })
  {
    this.props = {path, label, ...props };
  }

  /**
   * Returns a deep clone of this object
   *
   * @method
   * @return {Object}
   */
  toJS = () => {
    return JSON.parse(JSON.stringify(this.props));
  };

  /**
   * @return {SFObject}
   */
  get path() { return this.props.path }

  /**
   * @return {Array<SFObjectField>}
   */
  get label() { return this.props.label }
}