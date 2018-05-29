import { fetch } from '../../../main/javascript/salesforce/http';
import { readUserInfo } from '../../../main/javascript/salesforce/api';

test('fetch retries authentication errors', () => {

  const requests = [];
  const dpappMock = {
    restApi : {
      fetchProxy : function (url, dpReq) {
        requests.push(["fetchProxy", url, dpReq]);

        const errorData = { statusCode: 403 };
        const error = new Error('API Error');
        error.errorData = errorData;

        return Promise.reject(error);
      }
    },
    oauth: {
      refreshAccess: function (oauthProviderName, options) {
        requests.push(["refreshAccess", oauthProviderName, options]);
        return Promise.resolve({})
      }
    },
    storage: {
      setAppStorage: function(valuesAndKeys) {
        requests.push(["setAppStorage", valuesAndKeys]);
        return Promise.resolve({})
      }
    }
  };

  return fetch(dpappMock, readUserInfo).then(x => {
    throw new Error('fetch should not resolve in case retry fails');
  }).catch(err => {
    const names = requests.map(entry => entry[0]);
    expect(names).toEqual(["fetchProxy", "refreshAccess", "setAppStorage", "fetchProxy"]);
  })

});