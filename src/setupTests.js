// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// https://github.com/dumbmatter/fakeIndexedDB
import "fake-indexeddb/auto";
import { deleteDB } from "idb";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";
import flushPromises from "flush-promises";

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
  console.info("Flushing promises...");
  try {
    await flushPromises();
  } catch (e) {
    console.warn(e);
  }

  console.info("Clearing local storage...");
  window.localStorage.clear();

  console.info("Clearing IndexedDB databases...");

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
    console.info(`Deleting database: ${database.name}`);
    await deleteDB(database.name);
  }

  // Replacing the factory also tosses out references to old databases.
  // It's unclear if this cleans up resources, hence we try to clean up above.
  indexedDB = new FDBFactory(); /* eslint no-native-reassign: "off" */

  console.debug("Removed all cached data.");
});
