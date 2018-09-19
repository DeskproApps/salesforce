/*
 * This is the main entry point for the browser. It's pre-configured
 * to boot the Deskpro Apps system and render your App. You usually
 * don't need to modify this unless you want to add some special
 * bootup behaviour.
 */

import { AppFrame } from '@deskpro/apps-components';
import { createApp } from '@deskpro/apps-sdk';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './agent';
import configureStore from './app/store';
import { Provider } from "react-redux";


createApp(dpapp => props =>
  configureStore(dpapp).then(store => ReactDOM.render(
    <AppFrame {...props}>
      <Provider store={store}>
        <App dpapp={dpapp} />
      </Provider>
    </AppFrame>,
    document.getElementById('root')
  ))

);
