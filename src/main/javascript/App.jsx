import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route } from '@deskpro/apps-sdk-react';
import { Loader } from '@deskpro/react-components';
import PageHome from './UI/PageHome'
import PageAuthenticate from './UI/PageAuthenticate'
import PageError from './UI/PageError'

import {
  tryAndSetAuthToken
} from './services';


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

    storage.getAppStorage([
      'user_settings'
    ]).then(data => {
      const { user_settings: settings } = data;

      if (tryAndSetAuthToken(settings, 'user_settings')) {
        return route.to('home');
      }

      return route.to('authenticate');

    }).catch(error => {
      route.to('error', {
        error: {
          type: 'Authentication Error',
          message: 'An error occurred trying to authenticate the app. Please check your settings and try again.'
        }
      });
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
