import moment from "moment";

import { Authenticator } from "./auth";
import User from "./ims/User";
import { testIncidentManagementSystem } from "./ims/TestIMS";


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
}


/*
 * Populate stored credentials.
 */
async function populateAuthStorage(username, credentials, source) {
  if (!username) {
    username = "Hubcap";
  }
  if (!credentials) {
    credentials = {password: username};
  }
  if (!source) {
    source = testIncidentManagementSystem();
  }

  await source.login(username, credentials);

  const store = window.localStorage;

  store.setItem(Authenticator.STORE_KEY_CLASS, source.constructor.name);
  store.setItem(
    Authenticator.STORE_KEY_USER, JSON.stringify(source.user.toJSON())
  );
}


describe("Authenticator", () => {

  afterEach(() => {
    Authenticator.eraseStorage();
  });

  test("authentication source is required", () => {
    const message = "authentication source is required";

    expect(() => {new Authenticator()}).toThrow(message);
    expect(() => {new Authenticator(undefined)}).toThrow(message);
    expect(() => {new Authenticator(null)}).toThrow(message);
  });

  test("initial state", () => {
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    expect(authenticator.source).toBe(source);
    expect(source.user).toBeNull();
  });

  test("eraseStorage", () => {
    verifyCleanAuthStorage();

    const username = "Hubcap";
    const credentials = { expiration: moment() };
    const user = new User(username, credentials);
    const expiration = moment();
    const store = window.localStorage;

    store.setItem(Authenticator.STORE_KEY_CLASS, "SomeAuthentationSource");
    store.setItem(Authenticator.STORE_KEY_USER, JSON.stringify(user.toJSON()));

    Authenticator.eraseStorage();

    expect(store.getItem(Authenticator.STORE_KEY_CLASS)).toBeNull();
    expect(store.getItem(Authenticator.STORE_KEY_USER)).toBeNull();
  });

  test("saveToStorage, logged in", async () => {
    verifyCleanAuthStorage();

    const username = "Hubcap";
    const credentials = { password: username };
    const source = testIncidentManagementSystem();
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

    const user = Authenticator._userFromStorage();

    expect(user).not.toBeNull();
    expect(user.username).toEqual(username);
  });

  test("saveToStorage, not logged in", () => {
    verifyCleanAuthStorage();

    const username = "Hubcap";
    const credentials = {password: username};
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    authenticator.saveToStorage();

    expect(Authenticator._sourceClassFromStorage()).toBeNull();
    expect(Authenticator._userFromStorage()).toBeNull();
  });

  test("loadFromStorage, empty", () => {
    verifyCleanAuthStorage();

    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    expect(authenticator.source.isLoggedIn()).toBe(false);
    expect(source.user).toBeNull();
  });

  test("loadFromStorage, populated, valid", async () => {
    verifyCleanAuthStorage();

    await populateAuthStorage();

    // Use a new auth source that wasn't used by populateAuthStorage to log in.
    const source = testIncidentManagementSystem()
    const authenticator = new Authenticator(source);

    expect(authenticator.source.isLoggedIn()).toBe(true);
  });

  test("loadFromStorage, populated, missing class", async () => {
    verifyCleanAuthStorage();

    await populateAuthStorage();

    // Remove class from otherwise valid storage
    window.localStorage.removeItem(Authenticator.STORE_KEY_CLASS);

    // Use a new auth source that wasn't used by populateAuthStorage to log in.
    const source = testIncidentManagementSystem()
    const authenticator = new Authenticator(source);

    expect(authenticator.source.isLoggedIn()).toBe(false);
    expect(source.user).toBeNull();
  });

  test("loadFromStorage, populated, unknown class", async () => {
    verifyCleanAuthStorage();

    await populateAuthStorage();

    // Set bogus class in otherwise valid storage
    window.localStorage.setItem(Authenticator.STORE_KEY_CLASS, "XYZZY");

    // Use a new auth source that wasn't used by populateAuthStorage to log in.
    const source = testIncidentManagementSystem()
    const authenticator = new Authenticator(source);

    expect(authenticator.source.isLoggedIn()).toBe(false);
    expect(source.user).toBeNull();
  });

  test("loadFromStorage, populated, missing user", async () => {
    verifyCleanAuthStorage();

    await populateAuthStorage();

    // Remove user from otherwise valid storage
    window.localStorage.removeItem(Authenticator.STORE_KEY_USER);

    // Use a new auth source that wasn't used by populateAuthStorage to log in.
    const source = testIncidentManagementSystem()
    const authenticator = new Authenticator(source);

    expect(authenticator.source.isLoggedIn()).toBe(false);
    expect(source.user).toBeNull();
  });

  test("loadFromStorage, populated, bogus user (invalid JSON)", async () => {
    verifyCleanAuthStorage();

    await populateAuthStorage();

    // Set bogus user in otherwise valid storage
    window.localStorage.setItem(Authenticator.STORE_KEY_USER, "*");

    // Use a new auth source that wasn't used by populateAuthStorage to log in.
    const source = testIncidentManagementSystem()
    const authenticator = new Authenticator(source);

    expect(authenticator.source.isLoggedIn()).toBe(false);
    expect(source.user).toBeNull();
  });

  test("loadFromStorage, populated, bogus user (no username)", async () => {
    verifyCleanAuthStorage();

    await populateAuthStorage();

    // Set user with no username in otherwise valid storage
    window.localStorage.setItem(
      Authenticator.STORE_KEY_USER, JSON.stringify({credentials: {}})
    );

    // Use a new auth source that wasn't used by populateAuthStorage to log in.
    const source = testIncidentManagementSystem()
    const authenticator = new Authenticator(source);

    expect(authenticator.source.isLoggedIn()).toBe(false);
    expect(source.user).toBeNull();
  });

  test("loadFromStorage, populated, bogus user (no credentials)", async () => {
    verifyCleanAuthStorage();

    await populateAuthStorage();

    // Set user without credentials in otherwise valid storage
    window.localStorage.setItem(
      Authenticator.STORE_KEY_USER, JSON.stringify({username: "Hubcap"})
    );

    // Use a new auth source that wasn't used by populateAuthStorage to log in.
    const source = testIncidentManagementSystem()
    const authenticator = new Authenticator(source);

    expect(authenticator.source.isLoggedIn()).toBe(false);
    expect(source.user).toBeNull();
  });

  test("load and save round-trip", async () => {
    verifyCleanAuthStorage();

    const username = "Hubcap";
    const credentials = {password: username};
    const source = testIncidentManagementSystem();
    const authenticator1 = new Authenticator(source);
    const now = moment();

    const result = await authenticator1.login(username, credentials);

    if (!result) { throw new Error("login failed"); }

    const authenticator2 = new Authenticator(source);

    expect(
      JSON.stringify(authenticator2.source.user.toJSON())
    ).toEqual(
      JSON.stringify(authenticator1.source.user.toJSON())
    );
  });

  test("valid login -> user", async () => {
    const username = "Hubcap";
    const password = username;
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }

    expect(source.user.username).toEqual(username);

    expect(authenticator.source.isLoggedIn()).toBe(true);
  });

  test("valid login -> expiration", async () => {
    const username = "Hubcap";
    const password = username;
    const now = moment();
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }

    const expiration = source.user.credentials.expiration;

    expect(expiration).toBeAfterMoment(now);
  });

  test("valid login -> stored", async () => {
    const username = "Hubcap";
    const password = username;
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);
    const now = moment();

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }

    const user = Authenticator._userFromStorage();

    expect(user).not.toBeNull();
    expect(user.username).toEqual(username);
  });

  test("valid login -> notify delegate", async () => {
    const username = "Hubcap";
    const password = username;
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    let notified = false;
    authenticator.delegate = () => { notified = true; }

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }

    expect(notified).toBe(true);
  });

  test("invalid login, first attempt", async () => {
    const username = "Hubcap";
    const password = "Not My Password";
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (result) { throw new Error("login failed to fail"); }

    expect(source.user).toBe(null);
    expect(authenticator.source.isLoggedIn()).toBe(false);
  });

  test("invalid login after prior login keeps user", async () => {
    const username = "Hubcap";
    const goodPassword = username;
    const badPassword = "Not My Password";
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);
    let result;

    result = await authenticator.login(
      username, {password: goodPassword}
    );

    if (!result) { throw new Error("login failed"); }

    result = await authenticator.login(
      username, {password: badPassword}
    );

    if (result) { throw new Error("login failed to fail"); }

    expect(source.user.username).toEqual(username);
    expect(authenticator.source.isLoggedIn()).toBe(true);
  });

  test("logout", async () => {
    const username = "Hubcap";
    const password = username;
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }
    if (!authenticator.source.isLoggedIn()) {
      throw new Error("isLoggedIn() fail?");
    }

    await authenticator.logout();

    expect(source.user).toBe(null);
    expect(authenticator.source.isLoggedIn()).toBe(false);
  });

  test("logout -> stored", async () => {
    const username = "Hubcap";
    const password = username;
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }
    if (!authenticator.source.isLoggedIn()) {
      throw new Error("isLoggedIn() fail?");
    }

    await authenticator.logout();

    expect(Authenticator._userFromStorage()).toBeNull();
  });

  test("valid login -> notify delegate", async () => {
    const username = "Hubcap";
    const password = username;
    const source = testIncidentManagementSystem();
    const authenticator = new Authenticator(source);

    const result = await authenticator.login(username, {password: password});

    if (!result) { throw new Error("login failed"); }
    if (!authenticator.source.isLoggedIn()) {
      throw new Error("isLoggedIn() fail?");
    }

    let notified = false;
    authenticator.delegate = () => { notified = true; }

    await authenticator.logout();

    expect(notified).toBe(true);
  });

});
