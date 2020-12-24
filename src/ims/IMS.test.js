import { DateTime } from "luxon";

import IncidentManagementSystem from "./IMS";
import {
  TestIncidentManagementSystem, testIncidentManagementSystem
} from "./TestIMS";


expect.extend({

  toBeJSONRequest(request) {
    if (!request.headers.has("Content-Type")) {
      return {
        message: () => "Request has no Content-Type header",
        pass: false,
      }
    }

    const contentType = request.headers.get("Content-Type");
    if (contentType != "application/json") {
      return {
        message: () => `Request Content-Type is not JSON: ${contentType}`,
        pass: false,
      }
    }

    return {
      message: () => "Request is a JSON request",
      pass: true,
    }
  },

  toBeJWTAuthenticatedRequest(request) {
    if (!request.headers.has("Authorization")) {
      return {
        message: () => "Request has no Authorization header",
        pass: false,
      }
    }

    const authorization = request.headers.get("Authorization");
    if (! authorization.startsWith("Bearer ")) {
      return {
        message: () => (
          `Request authorization lacks bearer token: ${authorization}`
        ),
        pass: false,
      }
    }

    return {
      message: () => "Request has authorization with bearer token",
      pass: true,
    }
  },

});


describe("IMS: init", () => {

  test("bagURL", () => {
    const url = "/ims/api/bag";
    const ims = new IncidentManagementSystem(url);

    expect(ims.bagURL).toEqual(url);
  });

  test("bagURL is required", () => {
    const message = "bagURL is required";

    expect(() => {new IncidentManagementSystem()}).toThrow(message);
    expect(() => {new IncidentManagementSystem(undefined)}).toThrow(message);
    expect(() => {new IncidentManagementSystem(null)}).toThrow(message);
    expect(() => {new IncidentManagementSystem("")}).toThrow(message);
  });

  test("initial state", () => {
    const url = "/ims/api/bag";
    const ims = new IncidentManagementSystem(url);

    expect(ims.bagURL).toEqual(url);
    expect(ims.delegate).toBeNull();
    expect(ims.user).toBeNull();
    expect(ims._credentialStore).not.toBeNull();
    expect(ims._bag).toBeNull();
  });

});


describe("IMS: HTTP requests", () => {

  test("_fetchJSON: default content type", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON(ims.bagURL);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request).toBeJSONRequest();
  });

  test("_fetchJSON: JSON content type given", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON(
      ims.bagURL, { headers: { "Content-Type": "application/json" } }
    );

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request).toBeJSONRequest();
  });

  test("_fetchJSON: JSON content type not given", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON(ims.bagURL);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request).toBeJSONRequest();
  });

  test("_fetchJSON: non-JSON content type", async () => {
    const ims = testIncidentManagementSystem();

    expect(
      ims._fetchJSON(ims.bagURL, { headers: { "Content-Type": "text/plain" } })
    ).toRejectWithMessage("Not JSON content-type: text/plain");
  });

  test("_fetchJSON: string with full URL", async () => {
    const url = "https://localhost/ims/api/bag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON(url);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request.url).toEqual(url);
  });

  test("_fetchJSON: string with path URL", async () => {
    const url = "/ims/api/bag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON(url);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request.url).toEqual(url);
  });

  test("_fetchJSON: with no JSON -> GET request", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON(ims.bagURL);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request.method).toEqual("GET");
  });

  test("_fetchJSON: with JSON -> POST request", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON("/json_echo", { json: {} });

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request.method).toEqual("POST");
  });

  test("_fetchJSON: non-JSON response -> OK", async () => {
    const ims = testIncidentManagementSystem();

    await expect(
      ims._fetchJSON("/text_hello")
    ).toRejectWithMessage("Response type is not JSON: text/plain")
  });

  test("_fetchJSON: non-JSON response -> non-OK", async () => {
    const ims = testIncidentManagementSystem();

    const response = await ims._fetchJSON("/not_found");

    expect(response.status).toEqual(404);
  });

  test("_fetchJSON: ETag with GET -> If-None-Match header", async () => {
    const eTag = "test-ETag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON(ims.bagURL, { eTag: eTag });

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request.headers.get("If-None-Match")).toEqual(eTag);
  });

  test("_fetchJSON: ETag with POST -> If-Match header", async () => {
    const eTag = "test-ETag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON("/json_echo", { json: {}, eTag: eTag });

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request.headers.get("If-Match")).toEqual(eTag);
  });

  test("_fetchJSON: not authenticated -> OK", async () => {
    const ims = testIncidentManagementSystem();

    const response = await ims._fetchJSON(ims.bagURL);

    expect(response.status).toEqual(200);
    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request).not.toBeJWTAuthenticatedRequest();
  });

  test("_fetchJSON: authenticated -> OK", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});
    // Clear out request tracking from login
    ims.requestsReceived = [];

    const response = await ims._fetchJSON(ims.bagURL);

    expect(response.status).toEqual(200);
    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request).toBeJWTAuthenticatedRequest();
  });

  test("_fetchJSON: not authenticated -> 401 JSON with status", async () => {
    const ims = testIncidentManagementSystem();

    const response = await ims._fetchJSON("/auth_fail_json");

    expect(response.status).toEqual(401);
  });

  test("_fetchJSON: authenticated -> 401 text", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});
    // Clear out request tracking from login
    ims.requestsReceived = [];

    const response = await ims._fetchJSON("/auth_fail_json");

    expect(response.status).toEqual(401);
  });

});


describe("IMS: bag", () => {

  test("load bag: request content type", async () => {
    const ims = testIncidentManagementSystem();
    const bag = await ims.bag();

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request).toBeJSONRequest();
  });

  test("load bag: retrieved urls", async () => {
    const ims = testIncidentManagementSystem();
    const theBag = ims.testData.bag;
    const bag = await ims.bag();

    expect(bag).toBeDefined();
    expect(bag.urls).toBeDefined();

    for (const name in theBag.urls) {
      expect(bag.urls[name]).toEqual(theBag.urls[name]);
    }
  });

  test("load bag twice -> same bag", async () => {
    const ims = testIncidentManagementSystem();
    const bag1 = await ims.bag();
    const bag2 = await ims.bag();

    expect(bag2).toBe(bag1);
  });

  test("load bag: no URLs in response", async () => {
    const ims = testIncidentManagementSystem();
    ims.bagURL = "/janky_bag";
    await expect(ims.bag()).toRejectWithMessage("Bag does not have URLs: {}");
  });

  test("load bag: non-OK response", async () => {
    const ims = testIncidentManagementSystem();
    ims.bagURL = "/forbidden";
    await expect(ims.bag()).toRejectWithMessage("Failed to retrieve bag.");
  });

});


describe("IMS: authentication", () => {

  afterEach(() => {
    testIncidentManagementSystem().logout();
  });

  test("login: username is required", async () => {
    const message = "username is required";
    const ims = testIncidentManagementSystem();

    await expect(ims.login()).toRejectWithMessage(message);
    await expect(ims.login(undefined)).toRejectWithMessage(message);
    await expect(ims.login(null)).toRejectWithMessage(message);
  });

  test("login: credentials is required", async () => {
    const username = "Hubcap";
    const message = "credentials is required";
    const ims = testIncidentManagementSystem();

    await expect(ims.login(username)).toRejectWithMessage(message);
    await expect(ims.login(username, undefined)).toRejectWithMessage(message);
    await expect(ims.login(username, null)).toRejectWithMessage(message);
  });

  test("login: password is required", async () => {
    const username = "Hubcap";
    const message = "password is required";
    const ims = testIncidentManagementSystem();

    await expect(ims.login(username, {})).toRejectWithMessage(message);
    await expect(
      ims.login(username, {password: undefined})
    ).toRejectWithMessage(message);
    await expect(
      ims.login(username, {password: null})
    ).toRejectWithMessage(message);
  });

  test("login: request content type", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    expect(ims.requestsReceived).toHaveLength(2);

    const request = ims.requestsReceived[1];

    expect(request).toBeJSONRequest();
  });

  test("login: request body", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    expect(ims.requestsReceived).toHaveLength(2);

    const request = ims.requestsReceived[1];
    const json = request._json;

    expect(json.identification).toBeDefined();
    expect(json.identification).not.toBeNull();
    expect(json.password).toBeDefined();
    expect(json.password).not.toBeNull();
  });

  test("login -> user", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    const result = await ims.login(username, {password: password});

    expect(result).toBe(true);
    expect(ims.user).not.toBeNull();
  });

  test("login -> auth failed (bad credentials)", async () => {
    const username = "Hubcap";
    const password = "Not My Password";
    const ims = testIncidentManagementSystem();

    const result = await ims.login(username, {password: password});

    expect(result).toBe(false);
    expect(ims.user).toBeNull();
  });

  test("login -> auth failed (non-401)", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    // Need a non-401 error status
    const bag = await ims.bag();
    bag.urls.auth = "/forbidden";

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage(
      "Failed to authenticate: HTTP error status 403 Forbidden"
    );
    expect(ims.user).toBeNull();
  });

  test("login -> auth failed (non-JSON)", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    // Need a non-401 error status
    const bag = await ims.bag();
    bag.urls.auth = "/auth_fail_text";

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage(
      "Failed to authenticate: non-JSON response for login"
    );
    expect(ims.user).toBeNull();
  });

  test("login -> auth failed (JSON without status)", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    // Need a non-401 error status
    const bag = await ims.bag();
    bag.urls.auth = "/auth_fail_json_no_status";

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage(
      "Failed to authenticate: unknown JSON error status: undefined"
    );
    expect(ims.user).toBeNull();
  });

  test("login -> credentials with token", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    const result = await ims.login(username, {password: password});

    expect(result).toBe(true);
    expect(ims.user).not.toBeNull();
    expect(ims.user.credentials.token).toBeTruthy();
  });

  test("login -> result credentials are not expired", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();
    const now = DateTime.local();

    const result = await ims.login(username, {password: password});

    expect(result).toBe(true);
    expect(ims.user).not.toBeNull();
    expect(ims.user.credentials.expiration).toBeAfterDateTime(now);
  });

  test("login: response with different username", async () => {
    const username = "XYZZY";
    const password = username;
    const ims = testIncidentManagementSystem();

    const result = await ims.login(username, {password: password});

    expect(result).toBe(true);
    expect(ims.user.username).toEqual("Cretin");
  });

  test("login: response with no token", async () => {
    const username = "No Token";
    const password = username;
    const ims = testIncidentManagementSystem();

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage("No token in retrieved credentials");
  });

  test("login: response with no expiration", async () => {
    const username = "Forever";
    const password = username;
    const ims = testIncidentManagementSystem();

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage("No expiration in retrieved credentials");
  });

  test("login -> user -> logout", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    const result = await ims.logout();

    expect(result).toBe(true);
  });

  test("isLoggedIn(), not logged in", async () => {
    const ims = testIncidentManagementSystem();

    expect(ims.isLoggedIn()).toBe(false);
  });

  test("isLoggedIn(), logged in", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    expect(ims.isLoggedIn()).toBe(true);
  });

  test("isLoggedIn(), missing expiration", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    delete ims.user.credentials.expiration;

    expect(ims.isLoggedIn()).toBe(false);
  });

  test("isLoggedIn(), expired", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    ims.user.credentials.expiration = DateTime.local().minus({ seconds: 1 });

    expect(ims.isLoggedIn()).toBe(false);
  });

  test("login -> notify delegate", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    let notified = false;
    ims.delegate = () => { notified = true; }

    const result = await ims.login(username, {password: password});

    expect(notified).toBe(true);
  });

  test("logout -> notify delegate", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    let notified = false;
    ims.delegate = () => { notified = true; }

    await ims.logout();

    expect(notified).toBe(true);
  });

  test("login -> stored", async () => {
    const username = "Hubcap";
    const password = username;
    const ims1 = testIncidentManagementSystem();

    await ims1.login(username, {password: password});

    const ims2 = testIncidentManagementSystem();

    expect(ims2.user.toJSON()).toEqual(ims2.user.toJSON());
  });

  test("logout -> stored", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});
    await ims.logout();

    const ims2 = testIncidentManagementSystem();

    expect(ims2.user).toBeNull();
  });

});


describe("IMS: events", () => {

  afterEach(() => {
    testIncidentManagementSystem().logout();
  });

  test("events(), ok", async () => {
    const ims = await testIncidentManagementSystem().asHubcap();

    const events = await ims.events();

    expect(events.map((event) => event.toJSON())).toEqual(ims.testData.events);
  });

  test("events(), failed", async () => {
    const ims = await testIncidentManagementSystem().asHubcap();

    const bag = await ims.bag();
    bag.urls.events = "/forbidden";

    await expect(ims.events()).toRejectWithMessage(
      "Failed to retrieve events."
    );
  });

});
