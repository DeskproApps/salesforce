import {SFObject, SFObjectField} from "../salesforce/models";
import {ContextProperty} from "../deskpro/ContextProperty";
import {ContextDetails} from "../deskpro/ContextDetails";

export default class ContextMapping
{
  /**
   * @param {String | Object} js
   * @returns {ContextMapping}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const { field, object, context, property, ...props } = data;

    return new ContextMapping({
      field : SFObjectField.instance(field),
      object: SFObject.instance(object),
      context: ContextDetails.instance(context),
      property: ContextProperty.instance(property),
      ...props
    });
  }

  /**
   * @param {SFObjectField} field
   * @param {SFObject} object
   * @param {ContextDetails} context
   * @param {ContextProperty} property
   * @param {...*} [props]
   */
  constructor({ field, object, context, property, ...props })
  {
    this.props = { field, object, context, property, ...props };
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
   * @param {ContextMapping} other
   * @return {boolean}
   */
  equals(other) {
    const sameInstance = other instanceof ContextMapping;
    if (! sameInstance) {
      return false;
    }

    return this.property.name === other.property.name &&
      this.context.name === other.context.name &&
      this.field.name === other.field.name &&
      this.object.name === other.object.name
    ;
  }

  /**
   * @type {SFObjectField}
   */
  get field() { return this.props.field; }

  /**
   * @type {SFObject}
   */
  get object() { return this.props.object; }

  /**
   * @type {ContextDetails}
   */
  get context() { return this.props.context; }

  /**
   * @type {ContextProperty}
   */
  get property() { return this.props.property; }
}