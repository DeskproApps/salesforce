import ReactDOM from 'react-dom';
import { createAppContainer } from '@deskpro/apps-sdk-react';
import AppAgent from './AppAgent';

/**
 * @param appClient @see https://deskpro.github.io/apps-sdk-core/reference/AppClient.html
 */
export function runApp(appClient)
{
  const container = createAppContainer(appClient)(<AppAgent dpapp={appClient} />);
  ReactDOM.render(container, document.getElementById('deskpro-app'));
}
