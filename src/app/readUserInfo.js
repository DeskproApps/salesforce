import { userInfo as selectUserInfo } from "../salesforce/dux.state";
import { loadUserInfo, unloadUserInfo } from "../salesforce/dux";
import { logAndReject } from "../common/logging";

/**
 * @param {Function} [fetchClientFactory] a custom salesforce http fetch function
 * @return {function}
 */
export default function readUserInfo(fetchClientFactory)
{
  /**
   * @param {Function} dispatch
   * @param {Function} getState
   * @param {AppClient} dpapp
   */
  function thunk (dispatch, getState, dpapp) {

    const state = getState();
    const userInfo = selectUserInfo(state);

    if (userInfo) {
      return Promise.resolve(userInfo)
    }

    return dispatch(loadUserInfo(fetchClientFactory))
      .catch(logAndReject('readUserInfo error'))
      .catch (err => {
        dispatch(unloadUserInfo());
        return Promise.reject(err);
      })
  }

  return thunk;
}