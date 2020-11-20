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
  }

  loadFromStorage = () => {
    if (this.user !== null) {
      // Already loaded
      return;
    }

    const store = window.localStorage;
    const sourceClass = store.getItem(Authenticator.STORE_KEY_CLASS);

    if (!sourceClass) {
      console.log("No stored credentials found.");
    }
    else if (sourceClass !== this.source.constructor.name) {
      console.log("Ignoring stored credentials from class: " + sourceClass);
    }
    else {
      const userJSONText = store.getItem(Authenticator.STORE_KEY_USER);
      const expirationText = store.getItem(Authenticator.STORE_KEY_EXPIRATION);

      if (!userJSONText) {
        console.log("ERROR: No user found in stored credentials.");
        return;
      }

      if (!expirationText) {
        console.log("ERROR: No expiration found in stored credentials.");
        return;
      }

      console.log("Loading stored credentials...")

      let user;
      try {
        const userJSON = JSON.parse(userJSONText);
        user = User.fromJSON(userJSON);
      }
      catch {
        console.log("ERROR: Invalid user in stored credentials.");
        return;
      }

      const expiration = moment(expirationText, moment.ISO_8601, true);
      if (!expiration.isValid()) {
        console.log("ERROR: Invalid expiration in stored credentials.");
        return;
      }

      this.user = user
      this.expiration = expiration;
    }
  }

  /*
   * Authenticate a user and keep the resulting credentials.
   */
  login = async (username, credentials) => {
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
    console.log(`Logging out as ${this.user.username}...`)
    await this.source.logout();
    this.user = null;
    this.expiration = null;
  }

  /*
   * Determine whether we have a with non-expired credentials.
   */
  isLoggedIn = () => {
    this.loadFromStorage();
    return (this.user !== null);
  }

}


export const AuthenticatorContext = createContext();

AuthenticatorContext.displayName = "GlobalAuthenticatorContext"
