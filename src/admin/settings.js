import { apiVersions } from '../salesforce/http';

/**
 * @param {ApiVersion} a
 * @param {ApiVersion} b
 * @return {number}
 */
export function compareVersions(a, b)
{
  const versionA = parseInt(a.version.replace(/[^0-9]/gi, ''));
  const versionB = parseInt(b.version.replace(/[^0-9]/gi, ''));

  return versionA - versionB;
}

/**
 * @param {Array<ApiVersion>} versions
 * @return {ApiVersion}
 */
export function getLatestVersion(versions)
{
  return [].concat(versions).sort(compareVersions).pop()
}

/**
 * @param {AppClient} dpapp
 * @param {Object} settingsForm
 * @return {Promise<Object>}
 */
export function resolveSalesforceSettings(dpapp, settingsForm)
{
  const { instanceUrl } = settingsForm;

  return apiVersions(dpapp, instanceUrl)
    .then(getLatestVersion)
    .then(apiVersion => {
      if (! apiVersion ) {
        return Promise.reject(new Error('could not retrieve the api version'))
      }

      const { version } = apiVersion;
      if (! version) {
        return Promise.reject(new Error('api version is not defined'))
      }

      return ({instanceUrl, apiVersion: version})
    })
  ;

}
