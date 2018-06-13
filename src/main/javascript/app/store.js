import { configureStore as dpConfigureStore} from '@deskpro/apps-sdk-react'

import { getReducers }  from './reducers'
import { getInitialState } from './state'

import { loadMappings } from "./actions";

/**
 * @param {AppClient} dpapp
 * @return {{dispatch: function, getState: function}}
 */
export function createStore (dpapp)
{
  return dpConfigureStore(dpapp, [], getReducers(), getInitialState());
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