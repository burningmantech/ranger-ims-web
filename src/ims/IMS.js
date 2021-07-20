import invariant from "invariant";
import jwtDecode from "jsonwebtoken/decode";
import { DateTime } from "luxon";

import Store from "./Store";
import User from "./User";
import Event from "./model/Event";


export default class IncidentManagementSystem {

  constructor(bagURL) {
    invariant(bagURL, "bagURL is required");

    this._credentialStore = new Store("credentials", "user credentials", User);
    this._bagStore = new Store("bag", "URL bag");
    this._eventsStore = new Store("events", "event list", Event);

    Object.defineProperty(this, "user", {
      enumerable: true,

      get: () => {
        if (this._user === undefined) {
          const { value } = this._credentialStore.load();
          this._user = value;
        }
        return this._user;
      },

      set: (user) => {
        if (user === null) {
          this._credentialStore.remove();
        }
        else {
          this._credentialStore.store(user, null);
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

  _fetchJSONFromServer = async (url, options={}) => {
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

    const now = DateTime.local();
    if (cachedValue !== null && expiration > now) {
      console.debug(`Retrieved ${store.description} from unexpired cache`);
      return cachedValue;
    }

    // If we have a cached-but-expired value, check the server for a new value

    const url = (
      (urlID === "bag") ? this.bagURL : (await this.bag()).urls[urlID]
    );
    const fetchOptions = { eTag: cachedETag };
    const response = await this._fetchJSONFromServer(url, fetchOptions);

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

  bagCacheLifetime = { hours: 1 };

  bag = async () => {
    return this._fetchAndCacheJSON(
      "bag", this._bagStore, this.bagCacheLifetime
    );
  }

  ////
  //  Authentication
  ////

  login = async (username, credentials) => {
    invariant(username != null, "username is required");
    invariant(credentials != null, "credentials is required");
    invariant(credentials.password != null, "password is required");

    const bag = await this.bag();

    console.info(`Authenticating to IMS server as ${username}...`);

    const requestJSON = {
      identification: username, password: credentials.password
    };
    const response = await this._fetchJSONFromServer(
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

  eventsCacheLifetime = { minutes: 5 };

  events = async () => {
    return this._fetchAndCacheJSON(
      "events", this._eventsStore, this.eventsCacheLifetime
    );
  }

  eventWithID = async (id) => {
    for (const event of await this.events()) {
      if (event.id === id) { return event; }
    }
    throw new Error(`No event found with ID: ${id}`);
  }

}
