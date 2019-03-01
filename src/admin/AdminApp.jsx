import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, Route } from 'react-router'

import { SalesforceMappingList, SalesforceMappingAdd, TabNavigation, RouteDefinition } from '../ui'

const nav = [
  new RouteDefinition({ path: 'connection', label: 'Connection Settings' }),
  new RouteDefinition({ path: 'addObject', label: 'Add Salesforce Object' }),
  new RouteDefinition({ path: 'viewObjects', label: 'View Salesforce Objects' }),
];

class AdminApp extends React.Component
{
  static propTypes = {
    renderSettingsForm: PropTypes.func.isRequired,
    dpapp:         PropTypes.object.isRequired
  };

  state = {
    oauthSettings: null,
    error:         null
  };

  render()
  {
    return (
      <MemoryRouter initialEntries={nav.map(route => route.path)} initialIndex={0}>
        <div>
          <Route exact path={'connection'} render={this.renderTabConnectionSettings}/>
          <Route path={'addObject'}  render={this.renderTabAddSalesforceObject}/>
          <Route path={'viewObjects'}  render={this.renderTabViewSalesforceObject}/>
        </div>
      </MemoryRouter>
    )
  }

  renderTabConnectionSettings = ({match, location, history}) =>
  {
    return (
      <div>
        <TabNavigation items={nav} match={match} location={location} history={history} />
        {this.props.renderSettingsForm()}
      </div>
    );
  };

  renderTabAddSalesforceObject = ({match, location, history}) =>
  {
    return (
      <div>
        <TabNavigation items={nav} match={match} location={location} history={history} />
        <SalesforceMappingAdd />
      </div>
    );
  };

  renderTabViewSalesforceObject = ({match, location, history}) =>
  {
    return (
      <div>
        <TabNavigation items={nav} match={match} location={location} history={history} />
        <SalesforceMappingList />
      </div>
    );
  };
}

export default AdminApp;
