import moment from "moment";


export default class User {

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

  toString = () => {
    return this.username;
  }

  toJSON = () => {
    return { username: this.username, credentials: this.credentials };
  }

}
