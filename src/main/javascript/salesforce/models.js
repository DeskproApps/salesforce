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
   * @param {...*} props
   */
  constructor({...props}) {
    this.props = {...props};
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
   * @type {bool}
   */
  get nameField() {
    return this.props.nameField;
  }

}

export class DescribeGlobal
{
  /**
   * @param {Object|string} js
   * @returns {DescribeGlobal}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const sobjects = data.sobjects.map(SFObject.instance);
    return new DescribeGlobal({...data, sobjects})
  }

  /**
   * @param {...*} props
   */
  constructor({...props}) {
    this.props = {...props};
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
   * @public
   * @type {Number}
   */
  get maxBatchSize() {
    return this.props.maxBatchSize;
  }

  /**
   * @public
   * @type {Array<SFObject>}
   */
  get sobjects() { return this.props.sobjects; }
}

export class SObjectDescription
{
  /**
   * @param {Object|string} js
   * @returns {SObjectDescription}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const fields = data.fields ? data.fields.map(SFObjectField.instance) : [];
    const childRelationships = data.childRelationships ? data.childRelationships.map(ChildRelationship.instance) : [];

    return new SObjectDescription({...data, fields, childRelationships})
  }

  /**
   * @param {...*} props
   */
  constructor({...props}) {
    this.props = {...props};
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
   * @public
   * @type {bool}
   */
  get custom() {
    return this.props.custom;
  }

  /**
   * @public
   * @type {Array<SFObjectField>}
   */
  get fields() { return this.props.fields; }

  /**
   * @public
   * @type {Array<ChildRelationship>}
   */
  get childRelationships() { return this.props.childRelationships; }
}

