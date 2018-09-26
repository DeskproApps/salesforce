import React from 'react';


import { createStore } from '../src/app/store';

/**
 * @param {AppClient} [dpapp]
 * @param {Object} [additionalState]
 * @return {{dispatch: function, getState: function}}
 */
export function createMockStore({ dpapp, additionalState })
{
  if (!dpapp) {
    const mockDpApp = createMockDpapp();
    return createStore({}, additionalState)
  }

  return createStore(dpapp, additionalState)
}

