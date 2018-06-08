import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route } from '@deskpro/apps-sdk-react';
import { Loader } from '@deskpro/react-components';
import { PageHome, PageAuthenticate, PageError } from '../ui'
import {SalesforceAuthenticationError} from "../salesforce/security";
import { default as connector} from './connector'

/**
 * Renders a Deskpro app.
 */
class AgentApp extends React.Component {

  static propTypes = {
    /**
     * Instance of the Deskpro App Sdk Client
     */
    dpapp: PropTypes.object,

    readUserInfo: PropTypes.func.isRequired,

    loadMappings: PropTypes.func.isRequired
  };

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {

    const { oauth, mappings, context, ui, route, dpapp } = this.props;
    const { storage } = this.props.dpapp;

    this.props.loadMappings()
      .then(mappings => {
        console.log('the mappings ', mappings);
        return mappings;
      })
      .then(() => this.props.readUserInfo())
      .then(() => route.to('home'))
      .catch(err => {
        if (err instanceof SalesforceAuthenticationError) {
          return route.to('authenticate');
        }
        route.to('error', { error: err });
      });
  }

  render() {
      return (
        <Routes>
          <Route location={'authenticate'} component={PageAuthenticate} />
          <Route location={'home'} component={PageHome} />
          <Route location={'error'} component={PageError} />
          <Route defaultRoute>
            <div className="dp-text-center">
              <Loader />
            </div>
          </Route>
        </Routes>
      );

  }
}

const AgentAppConnected = connector(AgentApp);
export { AgentApp, AgentAppConnected }
