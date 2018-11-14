import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { default as reducer }  from './reducers'
import { getInitialState } from './state'

import { loadMappings, loadSettings } from "./actions";

export function createStore(dpapp, state)
{
  const initialState = state ? state : getInitialState()

  return reduxCreateStore(reducer, initialState, applyMiddleware(thunk.withExtraArgument(dpapp)))
}

/**
 * @param {AppClient} dpapp
 * @return {Promise<store, Error>}
 */
export default function configureStore (dpapp)
{
  const store = createStore(dpapp);
  return store.dispatch(loadMappings())
    .then(() => store.dispatch(loadSettings()))
    .then(() => store);
}
