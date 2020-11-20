import moment from "moment";

import { createContext } from "react";


export class User {

  static fromJSON = (json) => {
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

  asJSON = () => {
    return {username: this.username, credentials: this.credentials};
  }

}


export class TestAuthentationSource {

  static timeout = moment.duration(5, "minutes");

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
      }
      else if (!expirationText) {
        console.log("ERROR: No expiration found in stored credentials.");
      }
      else {
        console.log("Loading stored credentials...")

        const userJSON = JSON.parse(userJSONText);
        const user = User.fromJSON(userJSON);

        const expiration = moment(expirationText);

        this.user = user
        this.expiration = expiration;

        return;
      }

      this.user = null;
      this.expiration = null;
    }
  }

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

  logout = async () => {
    console.log(`Logging out as ${this.user.username}...`)
    await this.source.logout();
    this.user = null;
    this.expiration = null;
  }

  isLoggedIn = () => {
    this.loadFromStorage();
    return (this.user !== null);
  }

}


export const AuthenticatorContext = createContext();

AuthenticatorContext.displayName = "GlobalAuthenticatorContext"
