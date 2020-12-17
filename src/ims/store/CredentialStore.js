import User from "../User";


export default class CredentialStore {

  constructor(key) {
    this.key = key;
    this._storage = window.localStorage;
  }

  storeCredentials = (user) => {
    this._storage.setItem(this.key, JSON.stringify({ user: user.toJSON() }));
    console.log(`Stored credentials for user ${user} in local storage.`);
  }

  loadCredentials = () => {
    const jsonText = this._storage.getItem(this.key);

    let json;
    try {
      json = JSON.parse(jsonText);
    }
    catch (e) {
      throw new Error(`Unable to parse JSON for stored credentials: ${e}`);
    }

    if (json === null) {
      console.log("No credentials found in local storage.");
      return null;
    }

    if (json.user == null) {
      throw new Error("No user data in stored credentials.");
    }

    try {
      const user = User.fromJSON(json.user);
      console.log(`Loaded credentials for user ${user} from local storage.`);
      return user;
    }
    catch (e) {
      throw new Error(`Invalid user data in stored credentials: ${e}`);
    }
  }

  removeCredentials = () => {
    this._storage.removeItem(this.key);
    console.log("Removed stored credentials.");
  }

}
