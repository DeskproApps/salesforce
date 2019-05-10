import { SFObject, SFObjectField, RelatedObject, ReferencedObject } from "../salesforce/apiObjects";

export default class ObjectView
{
  /**
   * @param {String | Object} js
   * @returns {ObjectView}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const { fields, object, relatedObjects, referencedObjects, ...rest } = data;

    return new ObjectView({
      object: SFObject.instance(object),
      fields: fields.map(SFObjectField.instance),
      relatedObjects: (relatedObjects || []).map(RelatedObject.instance),
      referencedObjects: (referencedObjects || []).map(ReferencedObject.instance),
      ...rest
    });
  }

  /**
   * @param {SFObject} object
   * @param {Array<SFObjectField>} fields
   * @param {Array<RelatedObject>} relatedObjects
   * @param {Array<ReferencedObject>} referencedObjects
   * @param {...*} [props]
   */
  constructor({object, fields, relatedObjects, referencedObjects, ...props })
  {
    this.props = {object, fields, relatedObjects, referencedObjects, ...props };
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

  /**
   * @return {Array<ReferencedObject>}
   */
  get referencedObjects() { return this.props.referencedObjects }
}
