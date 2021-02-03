import jwtDecode from "jsonwebtoken/decode";
import { DateTime } from "luxon";

import Store from "./Store";
import User from "./User";
import Event from "./model/Event";


export default class IncidentManagementSystem {

  static _credentialStoreKey = "credentials";

  constructor(bagURL) {
    if (! bagURL) {
      throw new Error("bagURL is required");
    }

    Object.defineProperty(this, "user", {
      enumerable: true,

      get: () => {
        if (this._user === undefined) {
          const credentialStore = new Store(
            this._credentialStoreKey, "credentials", User
          );
          const { value } = credentialStore.load();
          this._user = value;
        }
        return this._user;
      },

      set: (user) => {
        const credentialStore = new Store(
          this._credentialStoreKey, "credentials", User
        );
        if (user === null) {
          credentialStore.remove();
        }
        else {
          credentialStore.store(user, null);
        }

        this._user = user;

        if (this.delegate !== null) {
          this.delegate();
        }
      },
    });

    this.bagURL = bagURL;
    this.delegate = null;
  }

  _fetch = async (request) => {
    let authenticated;
    if (this.isLoggedIn()) {
      authenticated = true;
      request.headers.set(
        "Authorization", `Bearer ${this.user.credentials.token}`
      );
    }
    else {
      authenticated = false;
    }

    console.debug(
      `Issuing ${authenticated ? "authenticated" : "unauthenticated"} ` +
      `request: ${request.method} ${request.url}`
    );
    const response = await fetch(request);

    if (! response.ok) {
      if (response.status === 401) {
        if (authenticated) {
          console.warn(`Authentication failed for resource: ${request.url}`);
          await this.logout();
        }
        else {
          console.debug(`Authentication required for resource: ${request.url}`);
        }
      }
      else {
        console.error(
          "Non-OK response from server " +
          `(${response.status}: ${response.statusText})`
        );
      }
    }

    return response;
  }

  _fetchJSON = async (url, options={}) => {
    const requestHeaders = new Headers(options["headers"]);

    // Ensure content type is JSON
    if (requestHeaders.has("Content-Type")) {
      const contentType = requestHeaders.get("Content-Type");
      if (contentType !== "application/json") {
        throw new Error(`Not JSON content-type: ${contentType}`);
      }
    }
    else {
      requestHeaders.set("Content-Type", "application/json");
    }

    const requestOptions = { headers: requestHeaders };
    if (options["json"] == null) {
      requestOptions.method = "GET";

      if (options["eTag"] != null) {
        requestHeaders.set("If-None-Match", options["eTag"]);
      }
    }
    else {
      requestOptions.method = "POST";
      requestOptions.body = JSON.stringify(options["json"]);;

      if (options["eTag"] != null) {
        requestHeaders.set("If-Match", options["eTag"]);
      }
    }

    const request = new Request(url, requestOptions);
    const response = await this._fetch(request);

    if (response.ok) {
      const responseContentType = response.headers.get("Content-Type");
      if (responseContentType !== "application/json") {
        throw new Error(`Response type is not JSON: ${responseContentType}`);
      }
    }

    return response;
  }

  _fetchAndCacheJSON = async(urlID, store, lifetime) => {
    const { value: cachedValue, tag: cachedETag, expiration } = store.load();

    // If we have a cached value and it hasn't expired, use that.

    if (cachedValue !== null && expiration > DateTime.local()) {
      return cachedValue;
    }

    // If we have a cached-but-expired value, check the server for a new value

    const bag = await this.bag();
    const url = bag.urls[urlID];
    const fetchOptions = { eTag: cachedETag };
    const response = await this._fetchJSON(url, fetchOptions);

    let _value;
    let _eTag;
    if (response.status === 304) {  // NOT_MODIFIED
      // The server says it's still the same, so keep the cached value.
      // Don't return yet... we'll store it below to update the expiration.
      _value = cachedValue;
      _eTag = cachedETag;
      console.debug(
        `Retrieved ${store.description} from cache (ETag: ${cachedETag})`
      );
    }
    else if (! response.ok) {
      // The server says "poop", so say "poop" to the caller.
      throw new Error(`Failed to retrieve ${store.description}.`);
    }
    else {
      // The server has a new value for us.
      _eTag = response.headers.get("ETag");
      const json = await response.json();
      _value = store.deserializeValue(json);
      console.debug(`Retrieved ${store.description} from ${url}`);
    }
    const value = _value;
    const eTag = _eTag;

    store.store(value, eTag, lifetime);

    return value;
  }

  ////
  //  Configuration
  ////

  bag_lifetime = { hours: 1 };

  bag = async () => {
    const store = new Store("bag", "URL bag");
    const { value: cachedBag, tag: cachedETag, expiration } = store.load();

    // If we have a cached bag and it hasn't expired, use that.

    if (cachedBag !== null && expiration > DateTime.local()) {
      return cachedBag;
    }

    // If we have a cached-but-expired bag, check the server.

    const url = this.bagURL;
    const fetchOptions = { eTag: cachedETag };
    const response = await this._fetchJSON(url, fetchOptions);

    let _bag;
    let _eTag;
    if (response.status === 304) {  // NOT_MODIFIED
      _bag = cachedBag;
      _eTag = cachedETag;
      console.debug(`Retrieved bag from cache (ETag: ${cachedETag})`);
    }
    else if (! response.ok) {
      throw new Error("Failed to retrieve bag.");
    }
    else {
      _eTag = response.headers.get("ETag");
      _bag = await response.json();
      console.debug(`Retrieved bag from ${url}`);
    }
    const bag = _bag;
    const eTag = _eTag;

    if (! bag.urls) {
      console.error(`Bag does not have URLs: ${JSON.stringify(bag)}`);
    }

    store.store(bag, eTag, this.bag_lifetime);

    return bag;
  }

  ////
  //  Authentication
  ////

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

    console.info(`Authenticating to IMS server as ${username}...`);

    const requestJSON = {
      identification: username, password: credentials.password
    };
    const response = await this._fetchJSON(
      bag.urls.auth, { json: requestJSON, headers: {} }
    );

    // Authentication failure yields a 401 response with a JSON error.
    let failureReason;
    if (response.status === 401) {
      let responseJSON;
      try {
        responseJSON = await response.json();
      }
      catch (e) {
        responseJSON = null;
      }

      if (responseJSON === null) {
        failureReason = "non-JSON response for login";
      }
      else {
        if (responseJSON.status === "invalid-credentials") {
          console.warn(`Credentials for ${username} are invalid.`);
          return false;
        }
        failureReason = `unknown JSON error status: ${responseJSON.status}`;
      }
    }
    else {
      failureReason = (
        `HTTP error status ${response.status} ${response.statusText}`
      );
    }

    if (! response.ok) {
      throw new Error(`Failed to authenticate: ${failureReason}`);
    }

    const responseJSON = await response.json();
    const token = responseJSON.token;

    if (token == null) {
      throw new Error("No token in retrieved credentials");
    }

    const jwt = jwtDecode(token);

    // Available but unused claims:
    // const personID = jwt.sub;
    // const issuer = jwt.iss;
    // const issued = DateTime.fromSeconds(jwt.iat);

    // Use username preferred by the IMS server
    const preferredUsername = jwt.preferred_username;
    if (preferredUsername != null && preferredUsername !== username) {
      console.debug(
        "Using preferred username in retrieved credentials " +
        `(${preferredUsername}), ` +
        `which differs from submitted username (${username})`
      );
      username = preferredUsername;
    }

    if (jwt.exp == null) {
      throw new Error("No expiration in retrieved credentials");
    }
    const expiration = DateTime.fromSeconds(jwt.exp);

    const imsCredentials = { token: token, expiration: expiration };

    this.user = new User(username, imsCredentials);

    console.info(
      `Logged in as ${this.user} until ${expiration.toISO()}.`
    );

    return true;
  }

  logout = async () => {
    console.info(`Logging out as ${this.user}...`);
    // FIXME: this should tell the server that the token we are using is no
    // longer needed.
    this.user = null;
    return true;
  }

  /*
   * Determine whether we have a user with non-expired credentials.
   */
  isLoggedIn = () => {
    const user = this.user;
    if (user === null) {
      return false;
    }

    return DateTime.local() < user.credentials.expiration;
  }

  ////
  //  Data
  ////

  events_lifetime = { minutes: 5 };

  events = async () => {
    const store = new Store("events", "event list", Event);
    return this._fetchAndCacheJSON("events", store, this.events_lifetime);
  }

}
