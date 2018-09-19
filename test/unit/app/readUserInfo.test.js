import { default as readUserInfo } from '../../../src/app/readUserInfo';
import { createMockStore, createMockDpapp } from '../../mocks';

test('readUserInfo sets userInfo to null on reject', () => {

  const actualDispatchedActions = [];
  const expectedDispatchedActions = [{type: 'LOAD_USER', userInfo: null}];
  const expectedLastAction = {type: 'LOAD_USER', userInfo: null};

  const dpapp = {};
  const store = createMockStore({ dpapp });

  const dispatch = action => {
    actualDispatchedActions.push(action);
    return store.dispatch(action);
  };

  const getState = () => ({
    salesforce: {
      userInfo: null
    }
  });

  const thunk = readUserInfo((dpapp) => (url, req) => Promise.reject(new Error()));
  return thunk(dispatch, getState, dpapp)
    .catch (err => {
      expect(actualDispatchedActions.length).toBeGreaterThan(0);
      const lastAction = actualDispatchedActions[actualDispatchedActions.length-1]
      expect(lastAction).toEqual(expectedLastAction)
    })

});
