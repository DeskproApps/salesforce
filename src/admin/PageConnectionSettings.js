import React from 'react';
import PropTypes from 'prop-types';
import { establishConnection, oauthConnectionFactory, oauthProviderName } from '../salesforce/security';
import { logAndReject } from '../common/logging'
import { resolveSalesforceSettings } from './settings'

/**
 * @param {object} settings
 * @return {object}
 */
function removeVirtualSettings(settings)
{
  const { instanceUrl, callbackUrl, ...rest } = settings;
  return rest;
}

export default class PageConnectionSettings extends React.Component
{
  static propTypes = {
    finishInstall: PropTypes.func.isRequired,
    settings:      PropTypes.array.isRequired,
    values:        PropTypes.array.isRequired,
    settingsForm:  PropTypes.func.isRequired,
    dpapp:         PropTypes.object.isRequired
  };

  state = {
    oauthSettings : null,
    error         : null,
    salesforce    : null
  };

  componentDidMount() {
    const { oauth, storage } = this.props.dpapp;

    Promise.resolve({
      oauthSettings : null,
      error         : null,
      salesforce    : null
    })
      .then(state => oauth.settings(oauthProviderName).then(oauthSettings => ({ ...state, oauthSettings })))
      .then(state => storage.getAppStorage('salesforce').then(salesforce => ({ ...state, salesforce })))
      .then(state => {
        this.setState(state)
      })
      .catch(logAndReject('installer error on mount'))
      .catch(error => {
        this.setState({
          error: typeof error === 'string' ? new Error(error) : error
        })
      })
    ;
  }

  onSettings = (settingsForm) => {
    const { finishInstall, dpapp } = this.props;

    const connectionProps = oauthConnectionFactory({
      ...settingsForm,
      urlRedirect:    this.state.oauthSettings.urlRedirect
    });

    resolveSalesforceSettings(dpapp, settingsForm).then(salesforce => ({ salesforce }))
      .then(otherSettings => {
        const cleanSettings = removeVirtualSettings(settingsForm);
        return { ...otherSettings, cleanSettings }
      })
      .then(storage => establishConnection(dpapp, connectionProps).then(() => storage))
      .then(storage => finishInstall(storage).then(({ onStatus }) => onStatus()))
      .catch(logAndReject("installer error"))
      .catch(error => typeof error === 'string' ? new Error(error) : error);
  };

  /**
   * @param {Array} settings
   * @param {Object} values
   * @return {{settings: Array, values: Object}}
   */
  injectSettingCallbackUrl({ settings, values })
  {
    const errorFree = this.state.error === null;
    const redirectUrl = this.state.oauthSettings ? this.state.oauthSettings.urlRedirect : null;

    let newSettings = [...settings];
    const newValues = { ...values, urlRedirect: errorFree ? 'Loading...' : 'Not Available' };

    if (redirectUrl && errorFree) {
      newValues.callbackUrl = redirectUrl;
      newSettings = newSettings.map(el => (el.name === 'callbackUrl' ? { ...el, defaultValue: redirectUrl } : el));
    }

    return { settings: newSettings, values: newValues };
  }

  /**
   * @param {Array} settings
   * @param {Object} values
   * @return {{settings: Array, values: Object}}
   */
  injectInstanceUrl({ settings, values })
  {
    const errorFree = this.state.error === null;
    const instanceUrl = this.state.salesforce ? this.state.salesforce.instanceUrl : '';

    let newSettings = [...settings];
    const newValues = { ...values, instanceUrl: errorFree ? instanceUrl : 'Not Available' };

    if (instanceUrl && errorFree) {
      newSettings = newSettings.map(el => (el.name === 'instanceUrl' ? { ...el, defaultValue: instanceUrl } : el));
    }

    return { settings: newSettings, values: newValues };
  }

  render() {

    const { finishInstall, settingsForm: SettingsForm } = this.props;

    if (this.props.settings.length) {

      let formProps = { settings: this.props.settings, values: this.props.values };
      formProps = this.injectSettingCallbackUrl(formProps);
      formProps = this.injectInstanceUrl(formProps);

      let formRef;
      return (
        <div className={'settings'}>
          <SettingsForm
            { ...formProps }
            ref={ref => { formRef = ref; }}
            onSubmit={this.onSettings}
          />
          <button className={'btn-action'} onClick={() => formRef.submit()}>
            Update Settings
          </button>
        </div>
      );
    }

    //no settings

    finishInstall(null)
      .then(({ onStatus }) => onStatus())
      .catch(error => new Error(error));

    return (<div/>);
  }
}
