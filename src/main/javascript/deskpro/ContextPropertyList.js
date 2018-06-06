import {ContextDetails} from "./ContextDetails";
import {MappableProperty} from "./MappableProperty";

export class ContextPropertyList
{
  /**
   * @param {String | Object} js
   * @returns {ContextPropertyList}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const { context, properties } = data;

    return new ContextPropertyList({
      context: ContextDetails.instance(context),
      properties: properties.map(MappableProperty.instance)
    })
  }

  /**
   * @param {ContextDetails} context
   * @param {Array<MappableProperty>} properties
   * @param {...*} [props]
   */
  constructor({context, properties, ...props })
  {
    this.props = {context, properties, ...props };
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
   * @type {ContextDetails}
   */
  get context() { return this.props.context; }

  /**
   * @type {Array<MappableProperty>}
   */
  get properties() { return [].concat(this.props.properties); }
}