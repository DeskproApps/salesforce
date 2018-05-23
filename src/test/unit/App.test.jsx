import React from 'react';
import { createAppFromProps } from '@deskpro/apps-sdk-core/lib/main/javascript/Core/createApp';
import WidgetWindowBridge from '@deskpro/apps-sdk-core/lib/main/javascript/Widget/WidgetWindowBridge.js'

import renderer from 'react-test-renderer';
import App from '../../main/javascript/App';

test('successfully render the application in initial state', done => {

  const contextProps = {
    // context
    type: 'ticket',
    entityId: '1',
    locationId: 'ticket-sidebar',
    tabId: 'tab-id',
    tabUrl: 'http://127.0.0.1'
  };

  const instanceProps = {
    appId: '1',
    appTitle: 'My First App',
    appPackageName: 'apps-boilerplate',
    instanceId: '1'
  };

  const widgetWindow = new WidgetWindowBridge({
    location : {
      search: 'somethingSomething',
      hash: `#somethingSomething`
    },
    document: { readyState : 'notReady' }
  }, {});

  const dpapp = createAppFromProps({ widgetWindow, contextProps, instanceProps });
  const component = renderer.create(<App dpapp={dpapp} />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  done();
});