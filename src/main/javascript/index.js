import ReactDOM from 'react-dom';
import { DeskproSDK} from '@deskpro/apps-sdk-react';

import {default as configureStore} from './app/store';
import { default as AgentApp } from './agent';


/**
 * @param {AppClient} appClient @see https://deskpro.github.io/apps-sdk-core/reference/AppClient.html
 */
export function runApp(appClient)
{
  return configureStore(appClient).then(store => {
    ReactDOM.render(
      <DeskproSDK dpapp={appClient} store={store} component={AgentApp}/>,
      document.getElementById('deskpro-app')
    );
  });
}
//https://deskpro-dev/agent/?appstore.applicationId=9&appstore.environment=development&appstore.instanceId=10&appstore.storageadapter=fetch#app.tickets,inbox:agent,t.o:37,vis:7