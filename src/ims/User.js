import invariant from "invariant";
import { DateTime } from "luxon";

export default class User {
  static fromJSON = (json) => {
    if (json.credentials != null) {
      json.credentials.expiration = DateTime.fromISO(
        json.credentials.expiration
      );
    }
    return new User(json.username, json.credentials);
  };

  constructor(username, credentials) {
    invariant(username != null, "username is required");
    invariant(credentials != null, "credentials is required");
    invariant(
      credentials.expiration != null,
      "credentials.expiration is required"
    );

    this.username = username;
    this.credentials = credentials;
  }

  toString = () => {
    return this.username;
  };

  toJSON = () => {
    return { username: this.username, credentials: this.credentials };
  };
}
