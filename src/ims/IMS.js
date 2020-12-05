import moment from "moment";

import { User } from "../auth";


export default class IncidentManagementSystem {

  constructor(bagURL) {
    if (bagURL.constructor !== URL) {
      throw new TypeError("bagURL must be URL");
    }

    this.user = null;
    this.bagURL = bagURL;
    this._bag = null;
  }

  _fetch = async (request) => {
    console.log("Issuing request: " + request);
    return await fetch(request);
  }

  _fetchJSON = async (url, headers={}, json="") => {
    if (headers["Content-Type"] === undefined) {
      headers["Content-Type"] = "application/json";
    }
    else if (headers["Content-Type"] !== "application/json") {
      throw new Error("Not JSON content-type: " + headers["Content-Type"]);
    }

    if (typeof(url) === "string") {
      url = this.bagURL.origin + url;
    }

    const request = new Request(
      url, { mode: "no-cors", headers: new Headers(headers) }
    );
    const response = await this._fetch(request);

    const responseContentType = response.headers.get("Content-Type");
    if (responseContentType !== "application/json") {
      throw new Error("Response type is not JSON: " + responseContentType);
    }

    return await response.json();
  }

  _loadBag = async () => {
    console.log("Retrieving bag from IMS server...");

    const bag = await this._fetchJSON(this.bagURL);

    console.log("IMS bag: " + JSON.stringify(bag));

    if (bag.urls == null) {
      throw new Error("Bag does not have URLs: " + bag);
    }

    return bag;
  }

  bag = async () => {
    if (this._bag !== null) {
      return this._bag;
    }
    else {
      this._bag = await this._loadBag();
    }
    return this._bag;
  }

  /*
   * Authentication source login hook for Authenticator.
   * See TestAuthentationSource.login for an example.
   */
  login = async (username, credentials) => {
    if (username == null) {
      throw new Error("username is required")
    }
    if (credentials == null) {
      throw new Error("credentials is required")
    }
    if (credentials.password == null) {
      throw new Error("password is required")
    }

    console.log("Authenticating to IMS server...");

    const bag = await this.bag();
    const url = bag.urls.auth;
    const result = await this._fetchJSON(url);

    console.log("IMS Credentials: " + JSON.stringify(result));

    if (result.expires_in == null) {
      throw new Error("No expiration in retrieved credentials");
    }
    const expiration = moment(result.expires_in);
    if (! expiration.isValid()) {
      throw new Error(
        "Invalid expiration in retrieved credentials: " + result.expires_in
      );
    }

    const imsCredentials = {
      expiration: expiration,
    }

    this.user = new User(username, imsCredentials);
  }

  /*
   * Authentication source logout hook for Authenticator.
   * See TestAuthentationSource.login for an example.
   */
  logout = async () => { return true; }

}
