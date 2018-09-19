import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'react-router'
import { createMemoryHistory } from 'history'
import { Loader } from '@deskpro/apps-components';

import { default as PageHome } from './PageHome'
import { default as PageAuthenticate } from './PageAuthenticate'
import { default as PageError } from './PageError'

import {SalesforceAuthenticationError} from "../salesforce/security";
import { reduxConnector } from '../app/connectors'
import { readUserInfo, loadMappings  } from '../app/actions'

const history = createMemoryHistory({
  initialEntries: ["loading"],
  initialIndex: 0
});

/**
 * Renders a Deskpro app.
 */
class AgentApp extends React.PureComponent
{

  static propTypes = {
    /**
     * Instance of the Deskpro App Sdk Client
     */
    dpapp: PropTypes.object,

    /**
     * Reads the salesforce user's info
     */
    readUserInfo: PropTypes.func.isRequired
  };

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {

    const { /** @type {Context} **/ context } = this.props.dpapp;
    const objectType = ['ticket', 'person', 'organization'].filter(type => context.available(type)).pop();

    this.props.readUserInfo()
      .then(() => context.get(objectType).get().then(({ data }) => data))
      .then(objectProperties => {
        history.push("home", { objectProperties, objectType });
      })
      .catch(error => {
        console.error(error);
        const route = error instanceof SalesforceAuthenticationError ? 'authenticate': 'error';
        history.push(route, { error });
        history.goForward();
      });
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path={'authenticate'} component={PageAuthenticate}/>
          <Route exact path={'home'} render={this.renderPageHome}/>
          <Route exact path={'error'} component={PageError}/>
          <Route render={props => (
            <div className="dp-text-center">
              <Loader />
            </div>
          )}/>
        </Switch>
      </Router>
    );
  }

  renderPageHome = ({match, location, history}) =>
  {
    const { objectProperties, objectType } = location.state;
    return (<PageHome dpapp={this.props.dpapp} objectProperties={objectProperties} objectType={objectType} history={history}/>);
  }

}

const AgentAppConnected = reduxConnector(AgentApp, { readUserInfo });
export { AgentApp, AgentAppConnected }
