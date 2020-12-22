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

  test("store", () => {
    const username = "Hubcap";
    const credentials = { expiration: moment() };
    const user = new User(username, credentials);
    const store = new CredentialStore(TEST_STORE_KEY);

    store.store(user);

    const jsonText = window.localStorage.getItem(TEST_STORE_KEY);
    expect(jsonText).toEqual(JSON.stringify({ user: user.toJSON() }));
  });

  test("load, empty", () => {
    const store = new CredentialStore(TEST_STORE_KEY);

    expect(store.load()).toBeNull();
  });

  test("load, valid", () => {
    const username = "Hubcap";
    const credentials = { expiration: moment() };
    const user = new User(username, credentials);
    const store = new CredentialStore(TEST_STORE_KEY);

    store.store(user);

    const userFromStore = store.load();
    expect(
      JSON.stringify(userFromStore.toJSON())
    ).toEqual(JSON.stringify(user.toJSON()));
  });

  test("load, invalid JSON", () => {
    window.localStorage.setItem(TEST_STORE_KEY, "*");

    const store = new CredentialStore(TEST_STORE_KEY);

    expect(
      () => { store.load() }
    ).toThrow("Unable to parse JSON for stored credentials: ");
  });

  test("load, missing user", () => {
    window.localStorage.setItem(TEST_STORE_KEY, "{}");

    const store = new CredentialStore(TEST_STORE_KEY);

    expect(
      () => { store.load() }
    ).toThrow("No user data in cached credentials.");
  });

  test("load, invalid user", () => {
    window.localStorage.setItem(TEST_STORE_KEY, '{"user": {}}');

    const store = new CredentialStore(TEST_STORE_KEY);

    expect(
      () => { store.load() }
    ).toThrow("Invalid user data in cached credentials: ");
  });

  test("remove", () => {
    const username = "Hubcap";
    const credentials = { expiration: moment() };
    const user = new User(username, credentials);
    const store = new CredentialStore(TEST_STORE_KEY);

    store.store(user);
    store.remove();

    expect(store.load()).toBe(null);
  });

});
