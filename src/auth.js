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

  static timeout = 1000 * 60 * 5;  // 5 minutes

  login = async (username, credentials) => {
    if (credentials.password === username) {
      const expiration = new Date();
      expiration.setTime(expiration.getTime() + TestAuthentationSource.timeout);

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

  login = async (username, credentials) => {
    console.log("Logging in as " + username + "...");
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
    console.log("Logging out as " + this.user.username + "...")
    await this.source.logout();
    this.user = null;
    this.expiration = null;
  }

  isLoggedIn = () => {
    return (this.user !== null);
  }

}


export const AuthenticatorContext = createContext();

AuthenticatorContext.displayName = "GlobalAuthenticatorContext"
