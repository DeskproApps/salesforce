/**
 * Logs the error and returns a rejected Promise so multiple `catch` calls can be chained
 *
 * @param {String} message
 * @return {function(Error): Promise<never>}
 */
export function logAndReject(message) {
  /**
   * @param {Error} err
   * @return {Promise<null, Error>}
   */
  function handler(err) {
    // console.log(message + ': ', err);
    console.log(message);
    return Promise.reject(err);
  }

  return handler;
}