import moment from "moment";

import { createContext } from "react";


/*
 * Authenticated user
 * - username: user identifier
 * - credentials: re-usable credentials to submit to server requests
 */
export class User {

  /*
   * Deserialize a User from JSON.
   */
  static fromJSON = (json) => {
    if (json.username === undefined) {
      throw new SyntaxError("No username provided.");
    }
    if (json.credentials === undefined) {
      throw new SyntaxError("No credentials provided.");
    }

    return new User(json.username, json.credentials);
  }

  constructor(username, credentials = {}) {
    if (username === undefined) {
      throw new Error("username is not defined");
    }
    if (username === null) {
      throw new Error("username is null");
    }

    this.username = username;
    this.credentials = credentials;
  }

  /*
   * Serialize a User as JSON.
   */
  asJSON = () => {
    return {username: this.username, credentials: this.credentials};
  }

}


/*
 * Test authentication source
 * - timeout: duration of time that credentials will be valid for
 */
export class TestAuthentationSource {

  static timeout = moment.duration(5, "minutes");

  /*
   * Logs into an authentication source.
   * - username: user identifier
   * - credentials: credentials for logging in: a dictionary with a password key
   *   that contains the password for the user.
   *
   * NOTE: the login credentials passed to this method are not the same as the
   *    re-usable credentials in the created User object.
   */
  login = async (username, credentials) => {
    if (credentials.password === username) {
      const expiration = moment().add(TestAuthentationSource.timeout);

      return {
        user: new User(username),
        expiration: expiration,
      };
    }
    else {
      return null;
    }
  }

  logout = async () => { return true; }

}


/*
 * Authenticator
 * Manages the mechanisms for obtaining authenticated users from an
 * authentication source.
 */
export class Authenticator {

  static STORE_KEY_CLASS = "ims.auth.class";
  static STORE_KEY_USER = "ims.auth.user";
  static STORE_KEY_EXPIRATION = "ims.auth.expiration";

  /*
   * Remove stored credentials.
   */
  static eraseStorage = () => {
    console.log("Removing credentials from local storage.");

    const store = window.localStorage;

    store.removeItem(Authenticator.STORE_KEY_CLASS);
    store.removeItem(Authenticator.STORE_KEY_USER);
    store.removeItem(Authenticator.STORE_KEY_EXPIRATION);
  }

  constructor(source) {
    if (source === undefined) {
      throw new Error("authentication source is not defined");
    }
    if (source === null) {
      throw new Error("authentication source is null");
    }

    this.source = source;
    this.user = null;
    this.expiration = null;
    this.loadFromStorage();
  }

  /*
   * Write state to local storage.
   */
  saveToStorage = () => {
    if (this.isLoggedIn()) {
      Authenticator._saveToStorage(
        this.source.constructor.name, this.user, this.expiration
      );
    }
    else {
      Authenticator.eraseStorage();
    }
  }

  static _saveToStorage = (className, user, expiration) => {
    console.log("Saving credentials in local storage.");

    const store = window.localStorage;

    store.setItem(Authenticator.STORE_KEY_CLASS, className);
    store.setItem(
      Authenticator.STORE_KEY_USER, JSON.stringify(user.asJSON())
    );
    store.setItem(
      Authenticator.STORE_KEY_EXPIRATION, expiration.toISOString()
    );
  }

  /*
   * Load state from local storage.
   */
  loadFromStorage = () => {
    const sourceClass = Authenticator._sourceClassFromStorage()

    if (sourceClass === null) {
      console.log("No stored credentials found.");
      return;
    }

    if (sourceClass !== this.source.constructor.name) {
      console.log("Ignoring stored credentials from class: " + sourceClass);
      return;
    }

    console.log("Loading stored credentials...")

    const user = Authenticator._userFromStorage();
    if (user === null) { return; }

    const expiration = Authenticator._expirationFromStorage();
    if (expiration === null) { return; }

    this.user = user;
    this.expiration = expiration;
  }

  static _sourceClassFromStorage = () => {
    const store = window.localStorage;
    const sourceClass = store.getItem(Authenticator.STORE_KEY_CLASS);
    if (!sourceClass) {
      return null;
    }
    return sourceClass;
  }

  static _userFromStorage = () => {
    const store = window.localStorage;
    const userJSONText = store.getItem(Authenticator.STORE_KEY_USER);
    try {
      const userJSON = JSON.parse(userJSONText);
      return User.fromJSON(userJSON);
    }
    catch {
      console.log("ERROR: Invalid user in stored credentials.");
      return null;
    }
  }

  static _expirationFromStorage = () => {
    const store = window.localStorage;
    const expirationText = store.getItem(Authenticator.STORE_KEY_EXPIRATION);

    if (!expirationText) {
      console.log("ERROR: No expiration found in stored credentials.");
      return null;
    }

    const expiration = moment(expirationText, moment.ISO_8601, true);
    if (!expiration.isValid()) {
      console.log("ERROR: Invalid expiration in stored credentials.");
      return null;
    }

    return expiration;
  }

  /*
   * Authenticate a user and keep the resulting credentials.
   */
  login = async (username, credentials) => {
    const result = await this._login(username, credentials);
    this.saveToStorage();
    return result;
  }

  _login = async (username, credentials) => {
    console.log(`Logging in as ${username}...`);
    const result = await this.source.login(username, credentials);

    if (result !== null) {
      this.user = result.user;
      this.expiration = result.expiration;
      console.log(
        "Logged in as " + this.user.username +
        " until " + this.expiration.toISOString()
      );
      return true;
    }
    else {
      console.log("Login failed.")
      return false;
    }
  }

  /*
   * Dispose of user credentials.
   */
  logout = async () => {
    const result = await this._logout();
    this.saveToStorage();
    return result;
  }

  _logout = async () => {
    console.log(`Logging out as ${this.user.username}...`)
    await this.source.logout();
    this.user = null;
    this.expiration = null;
  }

  /*
   * Determine whether we have a with non-expired credentials.
   */
  isLoggedIn = () => {
    return (this.user !== null);
  }

}


export const AuthenticatorContext = createContext();

AuthenticatorContext.displayName = "GlobalAuthenticatorContext"
