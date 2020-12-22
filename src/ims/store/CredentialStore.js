import User from "../User";


export default class CredentialStore {

  constructor(key) {
    this.key = key;
    this._storage = window.localStorage;
  }

  store = (user) => {
    this._storage.setItem(this.key, JSON.stringify({ user: user.toJSON() }));
    console.debug(`Stored credentials for user ${user} in local storage.`);
  }

  load = () => {
    const jsonText = this._storage.getItem(this.key);

    let json;
    try {
      json = JSON.parse(jsonText);
    }
    catch (e) {
      throw new Error(`Unable to parse JSON for stored credentials: ${e}`);
    }

    if (json === null) {
      console.debug("No cached credentials found in local storage.");
      return null;
    }

    if (json.user == null) {
      throw new Error("No user data in cached credentials.");
    }

    let user;
    try {
      user = User.fromJSON(json.user);
    }
    catch (e) {
      throw new Error(`Invalid user data in cached credentials: ${e}`);
    }

    console.log(`Loaded cached credentials for user ${user}.`);
    return user;
  }

  remove = () => {
    this._storage.removeItem(this.key);
    console.debug("Removed cached credentials.");
  }

}
