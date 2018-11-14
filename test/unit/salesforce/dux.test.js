import { loadUserInfo, loadObjects } from '../../../src/salesforce/dux';
import { UserInfo } from "../../../src/salesforce/apiObjects";
import responseObjects from "./response.getDescribeGlobal.json";

test('loadUserInfo resolves with expected value', () => {

  const expectedUserInfo = { name: "John", nickname: "Doe", email: "john.doe@example.com" }

  const actualDispatchedActions = [];
  const dispatch = action => {
    actualDispatchedActions.push(action)
  };

  const getState = () => ({
    salesforce: {}
  });

  const dpapp = {};
  const thunk = loadUserInfo((dpapp) => (url, req) => Promise.resolve({ body: expectedUserInfo }) );
  return thunk(dispatch, getState, dpapp)
    .then(userInfo => {
        expect( userInfo).toBeInstanceOf(UserInfo);
        expect(userInfo.toJSON()).toEqual(expectedUserInfo);
        expect(1).toEqual(actualDispatchedActions.length)
    })
});

test('loadObjects resolves with expected value', () => {

  const expectedResponse = JSON.parse(JSON.stringify(responseObjects));

  const actualDispatchedActions = [];
  const dispatch = action => {
    actualDispatchedActions.push(action)
  };

  const getState = () => ({
    salesforce: {}
  });

  const dpapp = {};
  const thunk = loadObjects((dpapp) => (url, req) => Promise.resolve({ body: expectedResponse }) );
  return thunk(dispatch, getState, dpapp)
    .then(objects => {
        expect( objects).toBeInstanceOf(Array);
        expect(JSON.stringify(objects)).toEqual(JSON.stringify(responseObjects.sobjects))
    })
});
