import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@deskpro/apps-components';

import { readUserInfo, readRecords } from '../app/actions'
import { reduxConnector } from '../app/connectors'
import { logAndReject } from '../common/logging'

class PageHome extends React.Component
{
  static propTypes = {

    /**
     * Instance of the Deskpro App Sdk Client
     */
    dpapp: PropTypes.object,

    /**
     * The properties of a Deskpro Object
     */
    objectProperties: PropTypes.object.isRequired,

    /**
     * The type of the Deskpro Object which the properties belong to
     */
    objectType: PropTypes.object.isRequired,

    /**
     * Reads the salesforce user's info
     */
    readUserInfo: PropTypes.func.isRequired,

    /**
     * Loads the mapped object
     */
    readRecords: PropTypes.func.isRequired,
  };

  state = {
    user: null
  };

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {
    const { ui, objectProperties, objectType } = this.props;

    Promise.resolve({ ready: true })
      .then(state => this.props.readUserInfo().then(user => ({ ...state, user })))
      .then(state => this.props.readRecords(objectProperties, objectType).then(records => ({ ...state, records })))
      .then(state => this.setState(state))
      .catch(logAndReject('page home error'))
      .catch(this.props.dpapp.ui.showErrorNotification)
    ;
  }

  render() {

    const { user, records, ready } = this.state;
    if (ready) {
      return (
        <div>
          <div>Logged in as {user.name}</div>

          {records.map(this.renderRecordSet)}
        </div>
      )
    }

    return(
      <div className="dp-text-center">
        <Loader />
      </div>
    )
  }

  /**
   * @param {RecordSet} recordSet
   */
  renderRecordSet = (recordSet) =>
  {
    return (
      <div>
        <h2>{recordSet.object.label}</h2>

        <ul>
          {recordSet.records.map(record => this.renderRecord(record))}
        </ul>
      </div>
    )
  };

  /**
   * @param {Record} record
   */
  renderRecord = (record) =>
  {
    return (
      <ul>
        <li>ID: {record.id}</li>
        {record.values.map(this.renderFieldValue)}
      </ul>
    );
  };

  /**
   * @param {FieldValue} fieldValue
   * @return {*}
   */
  renderFieldValue = (fieldValue) =>
  {
    return (
      <li>{fieldValue.field.label}: {fieldValue.asString()}</li>
    );
  }
}

export { PageHome };
export default reduxConnector(PageHome, { readUserInfo, readRecords });
