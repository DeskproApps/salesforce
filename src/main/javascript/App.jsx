import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route } from '@deskpro/apps-sdk-react';
import { Loader } from '@deskpro/react-components';
import { PageHome, PageAuthenticate, PageError } from './ui'

import { readUserInfo } from './salesforce/api';
import { fetch } from './salesforce/http';
import {SalesforceAuthenticationError} from "./salesforce/security";

/**
 * Renders a Deskpro app.
 */
export default class App extends React.Component {

  static propTypes = {
    /**
     * Instance of the Deskpro App Sdk Client
     */
    dpapp: PropTypes.object
  };

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {

    const { oauth, settings, context, ui, route, dpapp } = this.props;
    const { storage } = this.props.dpapp;

    fetch(dpapp, readUserInfo)
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
