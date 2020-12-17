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

  test("loadCredentials", () => {
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
