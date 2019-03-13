import React from 'react';
import PropTypes from 'prop-types';
import { Action, DataList, Panel, Icon, Separator } from '@deskpro/apps-components';

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
    objectType: PropTypes.string.isRequired,

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
    user: null,
    records: [],
    ready: false,
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
    const { records, ready } = this.state;
    if (ready) {
      return records.length ? this.renderNormal() : this.renderEmpty();
    }

    return this.renderLoading();
  }

  renderLoading()
  {
    return(
      <div className="dp-text-center">
        <Icon name={"refreshing"} />
      </div>
    )
  }

  renderEmpty()
  {
    <div>
      <p>No matching records found.</p>
    </div>
  }

  renderNormal()
  {
    const { records } = this.state;
    return records.map((recordSet) => recordSet.records.map(record => this.renderRecord(record)));
  }

  /**
   * @param {Record} record
   */
  renderRecord = (record) =>
  {
    const { user } = this.state;
    return [
      <Panel key={record.id} title={record.type.label} border={"none"}>
        <Action key="open" icon={"open"} onClick={() => window.open(user.objectUrl(record.id), "_blank")} />
        <DataList
          data={record.values.map(this.renderFieldValue)}
        />
      </Panel>,

      record.relatedResults && <Separator title="Related records" />,

      record.relatedResults && this.renderRelatedRecords(record.relatedResults)
    ];
  };

  renderRelatedRecords = (recordSets) =>
  {
    const { user } = this.state;
    return recordSets.map(
      recordSet => (
        recordSet.records.map(
          record => (
            <Panel key={record.id} title={record.type.label} border={"none"}>
              <Action key="open" icon={"open"} onClick={() => window.open(user.objectUrl(record.id), "_blank")} />
              <DataList
                data={record.values.map(this.renderFieldValue)}
              />
            </Panel>
          ))
        )
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
