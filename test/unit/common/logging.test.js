import {logAndReject} from "../../../src/common/logging";

test('logAndReject returns rejected promise', () => {

  const error = new Error();
  const logger = logAndReject('a message')
  return logger(error).catch(err => {
    expect(err).toEqual(error);
  })
});
