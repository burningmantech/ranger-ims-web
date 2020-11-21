import moment from "moment";

import { Authenticator, TestAuthentationSource, User } from "./auth";


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
});


describe("User", () => {

  test("username is defined", () => {
    const message = "username is not defined";

    expect(() => {new User()}).toThrow(message);
    expect(() => {new User(undefined, {})}).toThrow(message);
  });

  test("username is not null", () => {
    const message = "username is null";

    expect(() => {new User(null, {})}).toThrow(message);
  });

  test("asJSON", () => {
    const username = "Cheese Butter";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: {a: 1},
    };
    const user = new User(username, credentials);
    const userJSON = {username: username, credentials: credentials};

    expect(user.asJSON()).toEqual(userJSON);
  });

  test("fromJSON", () => {
    const username = "Cheese Butter";
    const credentials = {
      number: 1,
      text: "text",
      array: [1, 2, 3],
      dict: {a: 1},
    };
    const user = new User(username, credentials);
    const userJSON = user.asJSON();
    const result = User.fromJSON(userJSON);
    const resultJSON = result.asJSON();

    expect(resultJSON).toEqual(userJSON);
  });

});


describe("TestAuthentationSource", () => {

  test("valid login -> user", async () => {
    const username = "user";
    const password = username;
    const source = new TestAuthentationSource();
    const result = await source.login(username, {password: password});

    expect(result).not.toBeNull();

    const user = result.user;

    expect(user.username).toEqual(username);
    expect(user.credentials).toEqual({});
  });

  test("valid login -> expiration", async () => {
    const username = "user";
    const password = username;
    const now = moment();
    const source = new TestAuthentationSource();
    const result = await source.login(username, {password: password});

    expect(result).not.toBeNull();

    const expiration = result.expiration;

    expect(expiration).toBeAfterMoment(now);
  });

  test("invalid login -> null", async () => {
    const username = "user";
    const password = "Not My Password";
    const source = new TestAuthentationSource();
    const result = await source.login(username, {password: password});

    expect(result).toBeNull();
  });

});


/*
 * Make sure that we have no stored credentials.
 */
function verifyCleanAuthStorage() {
  const store = window.localStorage;

  // Make sure storage is clear
  if (store.getItem(Authenticator.STORE_KEY_CLASS)) {
    throw new Error("Found class in local storage.");
  }
  if (store.getItem(Authenticator.STORE_KEY_USER)) {
    throw new Error("Found user in local storage.");
  }
  if (store.getItem(Authenticator.STORE_KEY_EXPIRATION)) {
    throw new Error("Found expiration in local storage.");
  }
}


/*
 * Populate stored credentials.
 */
async function populateAuthStorage(username, credentials, source) {
  if (!username) {
    username = "Cheese Butter";
  }
  if (!credentials) {
    credentials = {password: username};
  }
  if (!source) {
    source = new TestAuthentationSource();
  }

  const {user, expiration} = await source.login(username, credentials);

  const store = window.localStorage;

  store.setItem(Authenticator.STORE_KEY_CLASS, source.constructor.name);
  store.setItem(Authenticator.STORE_KEY_USER, JSON.stringify(user.asJSON()));
  store.setItem(Authenticator.STORE_KEY_EXPIRATION, expiration.toISOString());

  return {source: source, user: user, expiration: expiration};
}


describe("Authenticator", () => {

  afterEach(() => {
    Authenticator._eraseStorage();
  });

  test("authentication source is defined", () => {
    const message = "authentication source is not defined";

    expect(() => {new Authenticator()}).toThrow(message);
    expect(() => {new Authenticator(undefined)}).toThrow(message);
  });

  test("authentication source is not null", () => {
    const message = "authentication source is null";

    expect(() => {new Authenticator(null)}).toThrow(message);
  });

  test("initial state", () => {
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);

    expect(authenticator.source).toBe(source);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("_eraseStorage", () => {
    verifyCleanAuthStorage();

    const username = "Cheese Butter";
    const credentials = {};
    const user = new User(username, credentials);
    const expiration = moment();
    const store = window.localStorage;

    store.setItem(Authenticator.STORE_KEY_CLASS, "SomeAuthentationSource");
    store.setItem(Authenticator.STORE_KEY_USER, JSON.stringify(user.asJSON()));
    store.setItem(Authenticator.STORE_KEY_EXPIRATION, expiration.toISOString());

    Authenticator._eraseStorage();

    expect(store.getItem(Authenticator.STORE_KEY_CLASS)).toBeNull();
    expect(store.getItem(Authenticator.STORE_KEY_USER)).toBeNull();
    expect(store.getItem(Authenticator.STORE_KEY_EXPIRATION)).toBeNull();
  });

  test("saveToStorage, logged in", async () => {
    verifyCleanAuthStorage();

    const username = "Cheese Butter";
    const credentials = {password: username};
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);
    const now = moment();

    const result = await authenticator._login(username, credentials);

    if (!result) { throw new Error("login failed"); }

    // Make sure we don't have accidental side effects from login
    verifyCleanAuthStorage();

    authenticator.saveToStorage();

    expect(Authenticator._sourceClassFromStorage()).toEqual(
      source.constructor.name
    );
    expect(Authenticator._userFromStorage()).not.toBeNull();
    expect(Authenticator._userFromStorage().username).toEqual(username);
    expect(Authenticator._expirationFromStorage()).toBeAfterMoment(now);
  });

  test("saveToStorage, not logged in", () => {
    verifyCleanAuthStorage();

    const username = "Cheese Butter";
    const credentials = {password: username};
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);

    authenticator.saveToStorage();

    expect(Authenticator._sourceClassFromStorage()).toBeNull();
    expect(Authenticator._userFromStorage()).toBeNull();
    expect(Authenticator._expirationFromStorage()).toBeNull();
  });

  test("loadFromStorage, empty", () => {
    verifyCleanAuthStorage();

    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);

    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(false);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("loadFromStorage, populated", async () => {
    verifyCleanAuthStorage();

    const { source, user, expiration } = await populateAuthStorage();
    const authenticator = new Authenticator(source);

    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(true);
    expect(authenticator.user.asJSON()).toEqual(user.asJSON());
    expect(authenticator.expiration).toBeSameAsMoment(expiration);
  });

  test("loadFromStorage, populated, missing class", async () => {
    verifyCleanAuthStorage();

    const { source, user, expiration } = await populateAuthStorage();
    const authenticator = new Authenticator(source);

    window.localStorage.removeItem(Authenticator.STORE_KEY_CLASS);
    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(false);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("loadFromStorage, populated, missing user", async () => {
    verifyCleanAuthStorage();

    const { source, user, expiration } = await populateAuthStorage();
    const authenticator = new Authenticator(source);

    window.localStorage.removeItem(Authenticator.STORE_KEY_USER);
    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(false);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("loadFromStorage, populated, bogus user (invalid JSON)", async () => {
    verifyCleanAuthStorage();

    const { source, user, expiration } = await populateAuthStorage();
    const authenticator = new Authenticator(source);

    window.localStorage.setItem(Authenticator.STORE_KEY_USER, "*");
    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(false);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("loadFromStorage, populated, bogus user (no username)", async () => {
    verifyCleanAuthStorage();

    const { source, user, expiration } = await populateAuthStorage();
    const authenticator = new Authenticator(source);

    window.localStorage.setItem(
      Authenticator.STORE_KEY_USER, JSON.stringify({credentials: {}})
    );
    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(false);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("loadFromStorage, populated, bogus user (no credentials)", async () => {
    verifyCleanAuthStorage();

    const { source, user, expiration } = await populateAuthStorage();
    const authenticator = new Authenticator(source);

    window.localStorage.setItem(
      Authenticator.STORE_KEY_USER, JSON.stringify({username: "Hubcap"})
    );
    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(false);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("loadFromStorage, populated, missing expiration", async () => {
    verifyCleanAuthStorage();

    const { source, user, expiration } = await populateAuthStorage();
    const authenticator = new Authenticator(source);

    window.localStorage.removeItem(Authenticator.STORE_KEY_EXPIRATION);
    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(false);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("loadFromStorage, populated, bogus expiration", async () => {
    verifyCleanAuthStorage();

    const { source, user, expiration } = await populateAuthStorage();
    const authenticator = new Authenticator(source);

    window.localStorage.setItem(Authenticator.STORE_KEY_EXPIRATION, "*");
    authenticator.loadFromStorage();

    expect(authenticator.isLoggedIn()).toBe(false);
    expect(authenticator.user).toBeNull();
    expect(authenticator.expiration).toBeNull();
  });

  test("load and save round-trip", async () => {
    verifyCleanAuthStorage();

    const username = "Cheese Butter";
    const credentials = {password: username};
    const source = new TestAuthentationSource();
    const authenticator1 = new Authenticator(source);
    const now = moment();

    const result = await authenticator1.login(username, credentials);

    if (!result) { throw new Error("login failed"); }

    const authenticator2 = new Authenticator(source);

    authenticator2.loadFromStorage();

    expect(authenticator2.user.asJSON()).toEqual(authenticator1.user.asJSON());
    expect(authenticator2.expiration).toBeSameAsMoment(
      authenticator1.expiration
    );
  });

  test("valid login -> user", async () => {
    const username = "user";
    const password = username;
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }

    const user = authenticator.user;

    expect(user.username).toEqual(username);
    expect(user.credentials).toEqual({});

    expect(authenticator.isLoggedIn()).toBe(true);
  });

  test("valid login -> expiration", async () => {
    const username = "user";
    const password = username;
    const now = moment();
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }

    const expiration = authenticator.expiration;

    expect(expiration).toBeAfterMoment(now);
  });

  test("valid login -> stored", async () => {
    const username = "user";
    const password = username;
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);
    const now = moment();

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }

    expect(Authenticator._userFromStorage()).not.toBeNull();
    expect(Authenticator._userFromStorage().username).toEqual(username);
    expect(Authenticator._expirationFromStorage()).toBeAfterMoment(now);
  });

  test("invalid login", async () => {
    const username = "user";
    const password = "Not My Password";
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (result) { throw new Error("login failed to fail"); }

    expect(authenticator.user).toBe(null);
    expect(authenticator.expiration).toBe(null);

    expect(authenticator.isLoggedIn()).toBe(false);
  });

  test("logout", async () => {
    const username = "user";
    const password = username;
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }
    if (!authenticator.isLoggedIn()) { throw new Error("isLoggedIn() fail?"); }

    await authenticator.logout();

    expect(authenticator.user).toBe(null);
    expect(authenticator.expiration).toBe(null);

    expect(authenticator.isLoggedIn()).toBe(false);
  });

  test("logout -> stored", async () => {
    const username = "user";
    const password = username;
    const source = new TestAuthentationSource();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }
    if (!authenticator.isLoggedIn()) { throw new Error("isLoggedIn() fail?"); }

    await authenticator.logout();

    expect(Authenticator._userFromStorage()).toBeNull();
    expect(Authenticator._expirationFromStorage()).toBeNull();
  });

});
