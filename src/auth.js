import { createContext } from "react";

export class User {

  constructor(username) {
    this.username = username;
  }

}


export class TestAuthentationSource {

  static timeout = 1000 * 60 * 5;  // 5 minutes

  login = async (username, credentials) => {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + TestAuthentationSource.timeout);

    return {
      user: new User(username),
      expiration: expiration,
    };
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

    if (result.user) {
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


const testAuthenticationSource = new TestAuthentationSource();
const testAuthenticator = new Authenticator(testAuthenticationSource);

export const authenticator = testAuthenticator;
export const AuthenticatorContext = createContext();

AuthenticatorContext.displayName = "GlobalAuthenticatorContext"
