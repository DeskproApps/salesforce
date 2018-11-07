import { SFObject, SFObjectField, RelatedObject } from "../salesforce/apiObjects";

export default class ObjectView
{
  /**
   * @param {String | Object} js
   * @returns {ObjectView}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const { fields, object, relatedObjects, ...rest } = data;

    return new ObjectView({
      object: SFObject.instance(object),
      fields: fields.map(SFObjectField.instance),
      relatedObjects: (relatedObjects || []).map(RelatedObject.instance),
      ...rest
    });
  }

  /**
   * @param {SFObject} object
   * @param {Array<SFObjectField>} fields
   * @param {Array<RelatedObject>} relatedObjects
   * @param {...*} [props]
   */
  constructor({object, fields, relatedObjects, ...props })
  {
    this.props = {object, fields, relatedObjects, ...props };
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

  /**
   * @return {Array<RelatedObject>}
   */
  get relatedObjects() { return this.props.relatedObjects }
}
