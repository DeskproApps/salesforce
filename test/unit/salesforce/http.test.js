import { clientFactory,apiUrl } from '../../../src/salesforce/http';
import { getUserInfo } from '../../../src/salesforce/api';

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

  const client = clientFactory(dpappMock, "https://eu8.salesforce.com", "v37.0");
  return getUserInfo(client).then(x => {
    throw new Error('fetch should not resolve in case retry fails');
  }).catch(err => {
    const names = requests.map(entry => entry[0]);
    expect(names).toEqual(["fetchProxy", "refreshAccess", "setAppStorage", "fetchProxy"]);
  })

});

test('apiUrl builds a versioned url', () => {
    const expectedUrl = 'https://eu8.salesforce.com/services/data/v43.0/sobjects';
    const actualUrl = apiUrl('/vXX.X/sobjects', 'https://eu8.salesforce.com', '43.0');
    expect(actualUrl).toEqual(expectedUrl);
});

test('apiUrl leaves absolute urls intact', () => {
    const expectedUrl = 'https://login.salesforce.com/services/oauth2/userinfo';
    const actualUrl = apiUrl(expectedUrl, 'https://eu8.salesforce.com', '43.0');
    expect(actualUrl).toEqual(expectedUrl);
});

test('apiUrl throws error if apiVersion is missing and resource url is versioned', () => {

  let error = null;
  try {
    apiUrl('/vXX.X/sobjects', 'https://eu8.salesforce.com')
  } catch (err) {
    error = err;
  }

  expect(error).toBeInstanceOf(Error);

});
