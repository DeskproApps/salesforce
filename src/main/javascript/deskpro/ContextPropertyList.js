import {ContextDetails} from "./ContextDetails";
import {MappableProperties} from "./MappableProperties";

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
      properties: properties.map(MappableProperties.parse)
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
    const json = JSON.parse(JSON.stringify(this.props));

    const { properties } = this.props;
    json.properties = properties.map(MappableProperties.toJSON);

    return json;
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