import {MappableProperty} from "./MappableProperty";
import {MappablePathProperty} from "./MappablePathProperty";

export class MappableProperties
{
  static TYPE_PATH_PROPERTY = 'path-property';

  /**
   * @param {String | Object} js
   * @returns {MappableProperty}
   */
  static parse(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const { type, property } = data;

    if (type === MappableProperties.TYPE_PATH_PROPERTY) {
      return MappablePathProperty.instance(property);
    }

    throw new Error('unknown property type')
  }

  /**
   * @param {MappableProperties} property
   */
  static toJSON(property)
  {
    if (property instanceof MappablePathProperty) {
      return {
        type: MappableProperties.TYPE_PATH_PROPERTY,
        property: property.toJSON()
      }
    }

    throw new Error('unknown property type')
  }

}