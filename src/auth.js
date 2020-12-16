import moment from "moment";


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
    if (json.credentials != null) {
      json.credentials.expiration = moment(json.credentials.expiration);
    }
    return new User(json.username, json.credentials);
  }

  constructor(username, credentials) {
    if (username == null) {
      throw new Error("username is required");
    }
    if (credentials == null) {
      throw new Error("credentials is required");
    }
    if (credentials.expiration == null) {
      throw new Error("credentials.expiration is required");
    }

    this.username = username;
    this.credentials = credentials;
  }

  /*
   * Serialize a User as JSON.
   */
  toJSON = () => {
    return {username: this.username, credentials: this.credentials};
  }

}


/*
 * Authenticator
 * Manages the mechanisms for obtaining authenticated users from an
 * authentication source.
 */
export class Authenticator {

  static STORE_KEY_CLASS = "ims.auth.class";
  static STORE_KEY_USER = "ims.auth.user";

  /*
   * Remove stored credentials.
   */
  static eraseStorage = () => {
    console.log("Removing credentials from local storage.");

    const store = window.localStorage;

    store.removeItem(Authenticator.STORE_KEY_CLASS);
    store.removeItem(Authenticator.STORE_KEY_USER);
  }

  constructor(source) {
    if (source == null) {
      throw new Error("authentication source is required");
    }

    this.source = source;
    this.loadFromStorage();
    this.delegate = null;
  }

  /*
   * Call the registered delegate function to provide a notification of a change
   * in user-logged-in state.
   */
  _notifyDelegate = () => {
    if (this.delegate !== null) {
      this.delegate();
    }
  }

  /*
   * Write state to local storage.
   */
  saveToStorage = () => {
    if (this.source.isLoggedIn()) {
      Authenticator._saveToStorage(
        this.source.constructor.name, this.source.user
      );
    }
    else {
      Authenticator.eraseStorage();
    }
  }

  static _saveToStorage = (className, user) => {
    console.log("Saving credentials in local storage.");

    const store = window.localStorage;

    store.setItem(Authenticator.STORE_KEY_CLASS, className);
    store.setItem(
      Authenticator.STORE_KEY_USER, JSON.stringify(user.toJSON())
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
      console.log(`Ignoring stored credentials from class: ${sourceClass}`);
      return;
    }

    const user = Authenticator._userFromStorage();
    if (user === null) { return; }

    console.log(`Loaded stored credentials for ${user}`)

    this.source.user = user;
  }

  static _sourceClassFromStorage = () => {
    const store = window.localStorage;
    const sourceClass = store.getItem(Authenticator.STORE_KEY_CLASS);
    if (sourceClass == null) {
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
    const user = this.source.user;

    if (result) {
      console.log(
        `Logged in as ${user.username} until ` +
        user.credentials.expiration.toISOString() + "."
      );
      this.source.user = user;
      this._notifyDelegate();
    }
    else {
      console.log("Login failed.");
      // We'll leave the previous user intact here...
    }

    return result;
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
    console.log(`Logging out as ${this.source.user.username}...`)
    await this.source.logout();
    this._notifyDelegate();
  }

  loggedInUser = () => {
    if (this.source.isLoggedIn()) {
      return this.source.user;
    }
    else {
      return null;
    }
  }

}
