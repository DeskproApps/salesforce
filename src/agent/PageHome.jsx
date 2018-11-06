import React from 'react';
import PropTypes from 'prop-types';
import { DataList, Loader, Panel } from '@deskpro/apps-components';

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
    const { dpapp, objectProperties, objectType, readRecords } = this.props;

    Promise.resolve({ ready: true })
      .then(state => this.props.readUserInfo().then(user => ({ ...state, user })))
      .then(state => readRecords(objectProperties, objectType).then(records => ({ ...state, records })))
      .then(state => this.setState(state))
      .catch(logAndReject('page home error'))
      .catch(dpapp.ui.showErrorNotification)
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
      <Panel title={recordSet.object.label} border={"none"}>
        {recordSet.records.map(record => this.renderRecord(record))}
      </Panel>
    )
  };

  /**
   * @param {Record} record
   */
  renderRecord = (record) =>
  {
    return (
      <DataList
        data={record.values.map(this.renderFieldValue)}
      />
    );
  };

  /**
   * @param {FieldValue} fieldValue
   * @return {*}
   */
  renderFieldValue = (fieldValue) =>
  {
    return {
      label: fieldValue.field.label,
      value: fieldValue.asString()
    };
  }
}

export { PageHome };
export default reduxConnector(PageHome, { readUserInfo, readRecords });
