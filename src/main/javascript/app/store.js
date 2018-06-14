import { configureStore as dpConfigureStore} from '@deskpro/apps-sdk-react'

import { getReducers }  from './reducers'
import { getInitialState } from './state'

import { loadMappings } from "./actions";

/**
 * @param {AppClient} dpapp
 * @param [additionalState]
 * @return {{dispatch: function, getState: function}}
 */
export function createStore (dpapp, additionalState)
{
  let initialState = getInitialState();
  if (additionalState) {
    initialState = {  ...initialState, ...additionalState }
  }
  return dpConfigureStore(dpapp, [], getReducers(), initialState);
}

/**
 * @param {AppClient} dpapp
 * @return {Promise<store, Error>}
 */
export default function configureStore (dpapp)
{
  const store = createStore(dpapp);
  return store.dispatch(loadMappings()).then(() => store);
}