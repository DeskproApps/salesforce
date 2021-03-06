import {ChildRelationship, Projection, SFObject, SFObjectField} from "./apiObjects";

class ResponseObject
{
  /**
   * @param {...*} props
   */
  constructor({...props}) {
    this.props = {...props};
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

export class DescribeGlobal extends ResponseObject
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
   * @param {object} props
   */
  constructor(props) {
    super(props)
  }

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

export class SObjectDescription extends ResponseObject
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
   * @param {object} props
   */
  constructor(props) {
    super(props)
  }

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

export class Query extends ResponseObject
{
  /**
   * @param {Object|string} js
   * @returns {Query}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    const {totalSize, nextRecordsUrl, records, ...rest} = data;

    return new Query({
      totalSize,
      nextRecordsUrl,
      records: records ? records.map(Projection.instance) : [],
      ...rest
    })
  }

  /**
   * @param {Number} totalSize
   * @param {String} nextRecordsUrl
   * @param {Array<>} records
   * @param {...*} props
   */
  constructor({totalSize, nextRecordsUrl, records, ...props}) {
    super ({totalSize, nextRecordsUrl, records, ...props});
  }

  /**
   * @public
   * @type {Number}
   */
  get totalSize() {
    return this.props.totalSize;
  }

  /**
   * @public
   * @type {Number}
   */
  get nextRecordsUrl() {
    return this.props.nextRecordsUrl;
  }

  /**
   * @public
   * @type {Array<Projection>}
   */
  get records() { return this.props.records; }
}