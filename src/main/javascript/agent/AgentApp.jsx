import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'react-router'
import { createMemoryHistory } from 'history'
import { Loader } from '@deskpro/react-components';

import { default as PageHome } from './PageHome'
import { default as PageAuthenticate } from './PageAuthenticate'
import { default as PageError } from './PageError'

import {SalesforceAuthenticationError} from "../salesforce/security";
import { default as connector} from '../app/connectors'
import { readUserInfo, loadMappings  } from '../app/actions'

const routes = ["home", "authenticate", "error", "loading"];
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

    const { tabData } = this.props;
    const { /** @type {Context} **/ context } = this.props.dpapp;

    this.props.readUserInfo()
      .then(() => {
        history.push("home", { contextData: tabData, contextName: context.object.type });
      })
      .catch(error => {
        console.log(error);
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
    const { contextData, contextName } = location.state;
    return (<PageHome contextData={contextData} contextName={contextName} history={history}/>);
  }

}

const AgentAppConnected = connector(AgentApp, { readUserInfo });
export { AgentApp, AgentAppConnected }
