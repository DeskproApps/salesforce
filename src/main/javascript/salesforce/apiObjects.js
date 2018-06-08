export class ChildRelationship
{
  /**
   * @param {String | Object} js
   * @returns {ChildRelationship}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    return new ChildRelationship(data)
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

  /**
   * @type {string}
   */
  get field() { return this.props.field; }

  /**
   * @type {string}
   */
  get childSObject() { return this.props.childSObject; }
}

export class SFObject
{
  /**
   * @param {String | Object} js
   * @returns {SFObject}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    return new SFObject(data)
  }

  /**
   * @param {String} name
   * @param {String} label
   * @param {...*} props
   */
  constructor({ name, label, ...props })
  {
    this.props = { name, label, ...props };
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
   * @type {string}
   */
  get label() { return this.props.label; }

  /**
   * @type {string}
   */
  get name() { return this.props.name; }
}

export class SFObjectField
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
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    return new SFObjectField(data)
  }

  /**
   * @param {string} name
   * @param {string} type
   * @param {string} label
   * @param {...*} props
   */
  constructor({name, type, label,...props}) {
    this.props = {name, type, label, ...props};
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

class RecordAttributes
{
  /**
   * @param {String | Object} js
   * @returns {RecordAttributes}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    return new RecordAttributes(data)
  }

  /**
   * @param {string} type
   * @param {string} url
   * @param [rest]
   */
  constructor({ type, url, ...rest })
  {
    this.props = { type, url, ...rest };
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
   * @type {string}
   */
  get type() { return this.props.type; }

  /**
   * @type {string}
   */
  get url() { return this.props.url; }

}

export class QueryRecord
{
  /**
   * @param {String | Object} js
   * @returns {QueryRecord}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const { attributes, ...fields }  = data;


    return new QueryRecord({
      attributes: RecordAttributes.instance(attributes),
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
    this.props = { attributes, ...rest };
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
   * @type {string}
   */
  get field() { return this.props.field; }

  /**
   * @type {string}
   */
  get childSObject() { return this.props.childSObject; }
}