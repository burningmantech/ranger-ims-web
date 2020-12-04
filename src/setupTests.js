// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';


expect.extend({

  toBeAfterMoment(received, other) {
    if (received.isAfter(other)) {
      return {
        message: () => `expected ${received} not to be after ${other}`,
        pass: true,
      }
    }
    else {
      return {
        message: () => `expected ${received} to be after ${other}`,
        pass: false,
      }
    }
  },

  toBeSameAsMoment(received, other) {
    if (received.isSame(other)) {
      return {
        message: () => `expected ${received} not to be the same as ${other}`,
        pass: true,
      }
    }
    else {
      return {
        message: () => `expected ${received} to be the same as ${other}`,
        pass: false,
      }
    }
  },

  async toRejectWithMessage(promise, message) {
    try {
      await promise;
    }
    catch (e) {
      if (e.message == message) {
        return {
          message: () => `Rejected with given message: ${e.message}`,
          pass: true,
        }
      }
      else {
        return {
          message: () => `Rejected with other message: ${e.message}`,
          pass: false,
        }
      }
    }

    return {
      message: () => "Did not reject",
      pass: false,
    }
  },

});
