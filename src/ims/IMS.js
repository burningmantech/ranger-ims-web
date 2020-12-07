import moment from "moment";

import { User } from "../auth";


export default class IncidentManagementSystem {

  constructor(bagURL) {
    if (! bagURL) {
      throw new Error("bagURL is required");
    }

    this.user = null;
    this.bagURL = bagURL;
    this._bag = null;
  }

  _fetch = (request) => {
    console.log(`Issuing request: ${request.method} ${request.url}`);
    return fetch(request);
  }

  _fetchJSON = async (url, json=null, headers={}) => {
    if (headers["Content-Type"] === undefined) {
      headers["Content-Type"] = "application/json";
    }
    else if (headers["Content-Type"] !== "application/json") {
      throw new Error(`Not JSON content-type: ${headers["Content-Type"]}`);
    }

    if (! typeof(bagURL) === "string") {
      if (typeof(url) === "string" && url[0] === "/") {
        url = this.bagURL.origin + url;
      }
    }

    const requestOptions = { mode: "no-cors", headers: new Headers(headers) }
    if (json == null) {
      requestOptions.method = "GET";
    }
    else {
      requestOptions.method = "POST";
      requestOptions.body = JSON.stringify(json);
    }

    const request = new Request(url, requestOptions);
    const response = await this._fetch(request);

    const responseContentType = response.headers.get("Content-Type");
    if (responseContentType !== "application/json") {
      throw new Error(`Response type is not JSON: ${responseContentType}`);
    }

    return await response.json();
  }

  bag = async () => {
    if (this._bag !== null) {
      return this._bag;
    }
    else {
      console.log("Retrieving bag from IMS server...");

      const bag = await this._fetchJSON(this.bagURL);

      if (bag.urls == null) {
        throw new Error(`Bag does not have URLs: ${bag}`);
      }

      this._bag = bag;
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

    const bag = await this.bag();

    console.log(`Authenticating to IMS server as ${username}...`);

    const requestJSON = {
      identification: username, password: credentials.password
    };
    const responseJSON = await this._fetchJSON(bag.urls.auth, requestJSON, {});

    if (responseJSON.status === "invalid-credentials") {
      console.log(`Sent invalid credentials for ${username}`);
      return;
    }

    if (responseJSON.username !== username) {
      throw new Error(
        `username in retrieved credentials (${responseJSON.username}) ` +
        `does not match username submitted (${username})`
      );
    }

    if (responseJSON.token == null) {
      throw new Error("No token in retrieved credentials");
    }

    if (responseJSON.expires_in == null) {
      throw new Error("No expiration in retrieved credentials");
    }
    const expiration = moment(responseJSON.expires_in);
    if (! expiration.isValid()) {
      throw new Error(
        "Invalid expiration in retrieved credentials: " +
        responseJSON.expires_in
      );
    }

    const imsCredentials = {
      token: responseJSON.token,
      expiration: expiration,
    }

    this.user = new User(username, imsCredentials);

    return this.user;
  }

  /*
   * Authentication source logout hook for Authenticator.
   * See TestAuthentationSource.login for an example.
   */
  logout = async () => { return true; }

}
