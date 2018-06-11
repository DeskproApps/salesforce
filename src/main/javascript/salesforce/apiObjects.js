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
}
