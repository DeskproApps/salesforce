import React from 'react';

import { createAppFromProps } from '@deskpro/apps-sdk-core';
import { WidgetWindowBridge } from '@deskpro/apps-sdk-core/lib/main/javascript/Widget/WidgetWindowBridge.js'

import { createStore } from '../main/javascript/app/store';

/**
 * @return {AppClient}
 */
export function createMockDpapp()
{
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

  const dpapp = createAppFromProps({ widgetWindow: null, contextProps, instanceProps });
  dpapp.manifest = {
    storage: []
  };

  return dpapp;
}

/**
 * @param {AppClient} [dpapp]
 * @return {{dispatch: function, getState: function}}
 */
export function createMockStore({ dpapp })
{
  if (!dpapp) {
    const mockDpApp = createMockDpapp();
    return createStore(mockDpApp)
  }

  return createStore(dpapp)
}

