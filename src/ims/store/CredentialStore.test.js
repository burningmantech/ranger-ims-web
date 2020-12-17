import moment from "moment";

import User from "../User";
import CredentialStore from "./CredentialStore";


const TEST_STORE_KEY = "org.burningman.rangers.ims.test.credentials";


describe("CredentialStore", () => {

  beforeEach(() => {
    if (window.localStorage.getItem(TEST_STORE_KEY) != null) {
      throw new Error("Found credentials in local storage.");
    }
  });

  afterEach(() => {
    window.localStorage.removeItem(TEST_STORE_KEY);
  });

  test("initial state", () => {
    const store = new CredentialStore(TEST_STORE_KEY);

    expect(store.key).toEqual(TEST_STORE_KEY);
  });

  test("storeCredentials", () => {
    const username = "Hubcap";
    const credentials = { expiration: moment() };
    const user = new User(username, credentials);
    const store = new CredentialStore(TEST_STORE_KEY);

    store.storeCredentials(user);

    const jsonText = window.localStorage.getItem(TEST_STORE_KEY);
    expect(jsonText).toEqual(JSON.stringify({ user: user.toJSON() }));
  });

  test("loadCredentials, empty", () => {
    const store = new CredentialStore(TEST_STORE_KEY);

    expect(store.loadCredentials()).toBeNull();
  });

  test("loadCredentials, valid", () => {
    const username = "Hubcap";
    const credentials = { expiration: moment() };
    const user = new User(username, credentials);
    const store = new CredentialStore(TEST_STORE_KEY);

    store.storeCredentials(user);

    const userFromStore = store.loadCredentials();
    expect(
      JSON.stringify(userFromStore.toJSON())
    ).toEqual(JSON.stringify(user.toJSON()));
  });

  test("loadCredentials, invalid JSON", () => {
    window.localStorage.setItem(TEST_STORE_KEY, "*");

    const store = new CredentialStore(TEST_STORE_KEY);

    expect(
      () => { store.loadCredentials() }
    ).toThrow("Unable to parse JSON for stored credentials: ");
  });

  test("loadCredentials, missing user", () => {
    window.localStorage.setItem(TEST_STORE_KEY, "{}");

    const store = new CredentialStore(TEST_STORE_KEY);

    expect(
      () => { store.loadCredentials() }
    ).toThrow("No user data in stored credentials.");
  });

  test("loadCredentials, invalid user", () => {
    window.localStorage.setItem(TEST_STORE_KEY, '{"user": {}}');

    const store = new CredentialStore(TEST_STORE_KEY);

    expect(
      () => { store.loadCredentials() }
    ).toThrow("Invalid user data in stored credentials: ");
  });

  test("removeCredentials", () => {
    const username = "Hubcap";
    const credentials = { expiration: moment() };
    const user = new User(username, credentials);
    const store = new CredentialStore(TEST_STORE_KEY);

    store.storeCredentials(user);
    store.removeCredentials();

    expect(store.loadCredentials()).toBe(null);
  });

});
