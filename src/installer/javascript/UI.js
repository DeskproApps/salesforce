import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, Route } from 'react-router'
import { Routes } from './Routes'

import { TabsInstaller } from './TabsInstaller'
import { TabConnectionSettings, TabAddSalesforceObject } from '@app/main/javascript/ui'

export class UI extends React.PureComponent
{

  static propTypes = {

    finishInstall: PropTypes.func.isRequired,

    settings:      PropTypes.array.isRequired,

    values:        PropTypes.array.isRequired,

    settingsForm:  PropTypes.func.isRequired,

    dpapp:         PropTypes.object.isRequired
  };

  render()
  {
    return (
      <MemoryRouter initialEntries={[ Routes.connection, Routes.mapping ]} initialIndex={0}>
        <div>
          <Route exact path={Routes.connection} render={this.renderTabConnectionSettings}/>
          <Route path={Routes.mapping}  render={this.renderTabAddSalesforceObject}/>
        </div>
      </MemoryRouter>
    )
  }

  renderTabConnectionSettings = ({match, location, history}) =>
  {
    return (
      <div>
        <TabsInstaller match={match} location={location} history={history} />
        <TabConnectionSettings {...this.props} />
      </div>
    );
  };

  renderTabAddSalesforceObject = ({match, location, history}) =>
  {
    return (
      <div>
        <TabsInstaller match={match} location={location} history={history} />
        <TabAddSalesforceObject {...this.props}/>
      </div>
    );
  };

}