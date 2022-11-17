// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/react";

// https://github.com/dumbmatter/fakeIndexedDB
import "fake-indexeddb/auto";
import { deleteDB } from "idb";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";
import flushPromises from "flush-promises";

// waitForElementToBeRemoved errors out if the element isn't there at least
// once, and that's causing grief.
// Possible issue:
//   https://github.com/testing-library/react-testing-library/issues/865
// We see the same flakiness, but it's not clear that it's the same root cause.

global.waitForElementNotToBePresent = async (elementGetter) => {
  await waitFor(() => {
    expect(elementGetter()).not.toBeInTheDocument();
  });
};

// Useful for generating test data

global.cartesian = (...a) => {
  return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
};

// Mute logging as desired

global.console = {
  ...console,
  debug: jest.fn(),
  // info: jest.fn(),
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

global.console._suppressErrors = () => {
  console.warn = console.error = jest.fn((e) => {
    console.info(e);
  });
};

// Increase timeouts in CI

if (process.env.CI != null) {
  jest.setTimeout(1 * 60 * 1000);
}

// Don't allow use of fetch()

/* eslint no-native-reassign: "off" */
fetch = jest.fn(async () => {
  throw new Error("Caught attempt to call fetch()");
});

// Add matchers

expect.extend({
  toEqualByValue(received, other) {
    received = JSON.stringify(received);
    other = JSON.stringify(other);
    if (received === other) {
      return {
        message: () => `expected ${received} not to equal by value ${other}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to equal by value ${other}`,
        pass: false,
      };
    }
  },

  toBeAfterDateTime(received, other) {
    if (received > other) {
      return {
        message: () => `expected ${received} not to be after ${other}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be after ${other}`,
        pass: false,
      };
    }
  },

  toEqualDateTime(received, other) {
    if (received.equals(other)) {
      return {
        message: () => `expected ${received} not to be the same as ${other}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be the same as ${other}`,
        pass: false,
      };
    }
  },

  async notToReject(promise) {
    try {
      await promise;
    } catch (e) {
      return {
        message: () => `Rejected with message: ${e.message}`,
        pass: false,
      };
    }
    return {
      message: () => "Did not reject",
      pass: true,
    };
  },

  async toRejectWithMessage(promise, message) {
    try {
      await promise;
    } catch (e) {
      if (e.message === message) {
        return {
          message: () => `Rejected with given message: ${e.message}`,
          pass: true,
        };
      } else {
        return {
          message: () => `Rejected with other message: ${e.message}`,
          pass: false,
        };
      }
    }

    return {
      message: () => "Did not reject",
      pass: false,
    };
  },
});

// Clean up after tests

afterEach(async () => {
  console.debug("Flushing promises...");
  try {
    await flushPromises();
  } catch (e) {
    console.warn(e);
  }

  console.debug("Clearing local storage...");
  window.localStorage.clear();

  console.debug("Clearing IndexedDB databases...");

  // FIXME: deleteDB never completes because nothing ever closes the databases.
  // See https://github.com/dumbmatter/fakeIndexedDB/issues/40

  // Attempt to close any outstanding databases connections
  // This uses a private attribute of fake-indexeddb because the IndexedDB
  // API doesn't appear to give us anything we can use.
  indexedDB._databases.forEach((database) => {
    database.connections.forEach((connection) => {
      connection.close();
    });
  });

  // Delete all databases
  const databases = await indexedDB.databases();
  for (const database of databases) {
    console.debug(`Deleting database: ${database.name}`);
    await deleteDB(database.name);
  }

  // Replacing the factory also tosses out references to old databases.
  // It's unclear if this cleans up resources, hence we try to clean up above.
  indexedDB = new FDBFactory(); /* eslint no-native-reassign: "off" */

  console.debug("Removed all cached data.");
});
