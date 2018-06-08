import {fetchAccessToken, storeAuthTokens} from "../salesforce/security";

export default function authenticate()
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    return fetchAccessToken(dpapp)
      .then(resp => {
        return storeAuthTokens(resp, dpapp)
      });
  }

  return thunk;
}