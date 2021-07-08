class ApiObject
{
  /**
   * @param {String | Object} raw
   * @return {*}
   */
  static parse(raw)
  {
    return typeof raw === 'string' ? JSON.parse(raw) : JSON.parse(JSON.stringify(raw));
  }

  /**
   * @param {...*} props
   */
  constructor({ ...props })
  {
    this.props = { ...props };
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
}

/**
 * @param {SFObjectField} left
 * @param {SFObjectField} right
 */
export const equalFields = (left, right) => left.name === right.name;

export function indexOf(item, list, equals)
{
  let index = -1;
  for (const listItem of list) {
    if (equals(item, listItem)) {
      return index + 1
    }
    index += 1;
  }

  return -1;
}

/**
 * @param {Array} left
 * @param {Array} right
 * @param {Function} equals
 * @return {Array}
 */
export function diff(left, right, equals)
{
  const diff = [];

  for (const leftItem of left) {
    for (const rightItem of right) {
      if (!equals(leftItem, rightItem)) {
        diff.push(leftItem);
        break;
      }
    }
  }

  return diff;
}

export class ChildRelationship extends ApiObject
{
  /**
   * @param {String | Object} js
   * @returns {ChildRelationship}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new ChildRelationship(data)
  }

  /**
   * @type {string}
   */
  get field() { return this.props.field; }

  /**
   * @type {string}
   */
  get childSObject() { return this.props.childSObject; }
}

export class SFObject extends ApiObject
{
  /**
   * @param {String | Object} js
   * @returns {SFObject}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new SFObject(data)
  }

  /**
   * @param {String} name
   * @param {String} label
   * @param {...*} props
   */
  constructor({ name, label, ...props })
  {
    super({ name, label, ...props });
  }

  /**
   * @type {string}
   */
  get label() { return this.props.label; }

  /**
   * @type {string}
   */
  get name() { return this.props.name; }
}

export class SFObjectField extends ApiObject
{
  static TYPE_REF = 'reference';

  static TYPE_STRING = 'string';

  static TYPE_ID = 'id';

  static TYPE_ADDRESS = 'address';

  static TYPE_BOOL = 'boolean';

  static TYPE_CURRENCY = 'currency';

  static TYPE_DOUBLE = 'double';

  static TYPE_INT = 'int';

  static TYPE_PHONE = 'phone';

  static TYPE_PICKLIST = 'picklist';

  static TYPE_URL = 'url';

  /**
   * @param {String|Object} js
   * @returns {SFObjectField}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new SFObjectField(data)
  }

  /**
   * @param {string} name
   * @param {string} type
   * @param {string} label
   * @param {...*} props
   */
  constructor({name, type, label,...props}) {
    super({name, type, label, ...props});
  }

  /**
   * @type {string}
   */
  get label() {
    return this.props.label;
  }

  /**
   * @type {string}
   */
  get name() {
    return this.props.name;
  }

  /**
   * @type {string}
   */
  set name(name) {
    this.props.name = name;
    return this;
  }

  /**
   * @type {string}
   */
  get type() {
    return this.props.type;
  }

  /**
   * @type {bool}
   */
  get nameField() {
    return this.props.nameField;
  }
}

export class SFObjectRelation extends ApiObject
{
  static TYPE_FOREIGN_FIELD = 'field';

  /**
   * @param {String|Object} js
   * @returns {SFObjectRelation}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new SFObjectRelation(data);
  }

  /**
   * @type {string}
   */
  get foreignField() {
    return this.props.field;
  }
}

export class SFObjectDescription extends ApiObject
{
  get fields() {
    return this.props.fields;
  }

  get relations() {
    return this.props.relations;
  }
}

export class RelatedObject extends ApiObject
{
  /**
   * @param {String | Object} js
   * @returns {RelatedObject}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new RelatedObject(data)
  }

  /**
   * @param {array} fields
   * @param {...*} props
   */
  constructor({fields, ...props}) {
    super(props);

    this.props.fields = fields || [];
  }

  addField(field) {
    let objectIndex = indexOf(field, this.props.fields, equalFields);
    if (objectIndex === -1) {
      this.props.fields.push(field);
    }
  }

  get fields() {
    return this.props.fields;
  }

  set fields(fields) {
    this.props.fields = fields;
    return this;
  }

  get name() {
    return this.props.childSObject;
  }

  get foreignField() {
    return this.props.field;
  }
}

export class ReferencedObject extends ApiObject
{
  /**
   * @param {String | Object} js
   * @returns {ReferencedObject}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new ReferencedObject(data)
  }

  /**
   * @param {array} fields
   * @param {...*} props
   */
  constructor({fields, ...props}) {
    super(props);

    this.props.fields = fields || [];
  }

  addField(field) {
    let objectIndex = indexOf(field, this.props.fields, equalFields);
    if (objectIndex === -1) {
      this.props.fields.push(field);
    }
  }

  get fields() {
    return this.props.fields;
  }

  set fields(fields) {
    this.props.fields = fields;
    return this;
  }

  get name() {
    return this.props.referenceTo[0];
  }

  get relationshipName() {
    return this.props.relationshipName;
  }
}

class ProjectionAttributes extends ApiObject
{
  /**
   * @param {String | Object} js
   * @returns {ProjectionAttributes}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new ProjectionAttributes(data)
  }

  /**
   * @param {string} type
   * @param {string} url
   * @param [rest]
   */
  constructor({ type, url, ...rest })
  {
    super({ type, url, ...rest });
  }

  /**
   * @type {string}
   */
  get type() { return this.props.type; }

  /**
   * @type {string}
   */
  get url() { return this.props.url; }

}

export class Projection extends ApiObject
{
  /**
   * @param {String | Object} js
   * @returns {Projection}
   */
  static instance(js)
  {
    const { attributes, ...fields } = ApiObject.parse(js);
    return new Projection({
      attributes: ProjectionAttributes.instance(attributes),
      ...fields
    })
  }

  /**
   *
   * @param {{type: string, url: string}} attributes
   * @param [rest]
   */
  constructor({ attributes, ...rest })
  {
    super({ attributes, fields: rest });
  }

  toJSON = () => {
    const { attributes, fields } = this.props;
    return JSON.parse(JSON.stringify({ attributes, ...fields }));
  };

  /**
   * @type {ProjectionAttributes}
   */
  get attributes() { return this.props.attributes; }

  /**
   * @type {{}}
   */
  get fields() { return this.props.fields; }
}

export class UserInfo extends ApiObject
{
  /**
   * @param {String | Object} js
   * @returns {UserInfo}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new UserInfo(data);
  }

  /**
   * @param {String} name
   * @param {String} nickname
   * @param {String} email
   * @param [rest]
   */
  constructor({ name, nickname, email, ...rest })
  {
    super({ name, nickname, email, ...rest });
  }

  /**
   * @type {string}
   */
  get name() { return this.props.name; }

  /**
   * @type {string}
   */
  get nickname() { return this.props.nickname; }

  get email() { return this.props.email; }

  objectUrl = (id) => {
    return this.props.profile.replace(/\/[^/]+$/, `/${id}`);
  }
}

export class ApiVersion extends ApiObject
{

  /**
   * @param {String | Object} js
   * @returns {ApiVersion}
   */
  static instance(js)
  {
    const data = ApiObject.parse(js);
    return new ApiVersion(data);
  }

  /**
   * @param {String} name
   * @param {String} label
   * @param {String} url
   * @param [rest]
   */
  constructor({ version, label, url, ...rest })
  {
    super({ version, label, url, ...rest });
  }

  /**
   * @type {string}
   */
  get version() { return this.props.version; }

  /**
   * @type {string}
   */
  get label() { return this.props.label; }

  /**
   * @return {*}
   */
  get url() { return this.props.url; }
}
