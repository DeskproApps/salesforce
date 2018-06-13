import { loadMappings } from '../../../main/javascript/mapping/dux';
import { createMockStore, createMockDpapp } from '../../mocks';

test('loadMappings return empty mappings when no mappings have been saved', () => {

  const actualDispatchedActions = [];

  const dpapp = createMockDpapp();
  dpapp.storage.getAppStorage = () => Promise.resolve(null);
  const store = createMockStore({ dpapp });

  const dispatch = action => {
    actualDispatchedActions.push(action);
    return store.dispatch(action);
  };

  const getState = store.getState.bind(store);

  const thunk = loadMappings();
  return thunk(dispatch, getState, dpapp)
    .then(({objectViews, contextMappings}) => {
    expect(objectViews).toBeInstanceOf(Array);
    expect(objectViews.length).toBe(0);
    expect(contextMappings).toBeInstanceOf(Array);
    expect(contextMappings.length).toBe(0);
  });

});