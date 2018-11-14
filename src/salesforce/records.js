export class Record
{
  /**
   * @param {string} id
   * @param {SFObject} type
   * @param {Array<FieldValue>} values
   * @param {Array<Record>} relatedResults
   */
  constructor({ id, type, values, relatedResults })
  {
    this.props = { id, type, values, relatedResults }
  }

  /**
   * @type {string}
   */
  get id() { return this.props.id; }

  /**
   * @type {SFObject}
   */
  get type() { return this.props.type; }

  /**
   * @type {Array<FieldValue>}
   */
  get values() { return this.props.values; }

  get relatedResults() {
    return this.props.relatedResults;
  }

  set relatedResults(results) {
    this.props.relatedResults = results;
    return this;
  }

}

export class RecordSet
{
  /**
   * @param {SFObject}  object
   * @param {Array<Record>} records
   */
  constructor({ object, records })
  {
    this.props = { object, records }
  }

  /**
   * @type {SFObject}
   */
  get object() { return this.props.object; }

  /**
   * @type {Array<Record>}
   */
  get records() { return this.props.records; }
}
