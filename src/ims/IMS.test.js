import { DateTime } from "luxon";

import Store from "./Store";
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

  test(
    "bagURL",
    () => {
      const url = "/ims/api/bag";
      const ims = new IncidentManagementSystem(url);

      expect(ims.bagURL).toEqual(url);
    }
  );

  test(
    "initial state", () => {
      const url = "/ims/api/bag";
      const ims = new IncidentManagementSystem(url);

      expect(ims.bagURL).toEqual(url);
      expect(ims.delegate).toBeNull();
      expect(ims.user).toBeNull();
      expect(ims._credentialStore).not.toBeNull();
    }
  );

});


describe("IMS: HTTP requests", () => {

  test(
    "_fetchJSONFromServer: default content type",
    async () => {
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer(ims.bagURL);

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request).toBeJSONRequest();
    }
  );

  test(
    "_fetchJSONFromServer: JSON content type given", async () => {
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer(
        ims.bagURL, { headers: { "Content-Type": "application/json" } }
      );

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request).toBeJSONRequest();
    }
  );

  test(
    "_fetchJSONFromServer: JSON content type not given", async () => {
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer(ims.bagURL);

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request).toBeJSONRequest();
    }
  );

  test(
    "_fetchJSONFromServer: non-JSON content type", async () => {
      const ims = testIncidentManagementSystem();

      expect(
        ims._fetchJSONFromServer(
          ims.bagURL, { headers: { "Content-Type": "text/plain" } }
        )
      ).toRejectWithMessage("Not JSON content-type: text/plain");
    }
  );

  test(
    "_fetchJSONFromServer: string with full URL", async () => {
      const url = "https://localhost/ims/api/bag";
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer(url);

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request.url).toEqual(url);
    }
  );

  test(
    "_fetchJSONFromServer: string with path URL", async () => {
      const url = "/ims/api/bag";
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer(url);

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request.url).toEqual(url);
    }
  );

  test(
    "_fetchJSONFromServer: with no JSON -> GET request", async () => {
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer(ims.bagURL);

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request.method).toEqual("GET");
    }
  );

  test(
    "_fetchJSONFromServer: with JSON -> POST request", async () => {
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer("/json_echo", { json: {} });

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request.method).toEqual("POST");
    }
  );

  test(
    "_fetchJSONFromServer: non-JSON response -> OK", async () => {
      const ims = testIncidentManagementSystem();

      await expect(
        ims._fetchJSONFromServer("/text_hello")
      ).toRejectWithMessage("Response type is not JSON: text/plain")
    }
  );

  test(
    "_fetchJSONFromServer: non-JSON response -> non-OK", async () => {
      const ims = testIncidentManagementSystem();

      const response = await ims._fetchJSONFromServer("/not_found");

      expect(response.status).toEqual(404);
    }
  );

  test(
    "_fetchJSONFromServer: ETag with GET -> If-None-Match header",
    async () => {
      const eTag = "test-ETag";
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer(ims.bagURL, { eTag: eTag });

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request.headers.get("If-None-Match")).toEqual(eTag);
    }
  );

  test(
    "_fetchJSONFromServer: ETag with POST -> If-Match header", async () => {
      const eTag = "test-ETag";
      const ims = testIncidentManagementSystem();

      await ims._fetchJSONFromServer("/json_echo", { json: {}, eTag: eTag });

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request.headers.get("If-Match")).toEqual(eTag);
    }
  );

  test(
    "_fetchJSONFromServer: not authenticated -> OK", async () => {
      const ims = testIncidentManagementSystem();

      const response = await ims._fetchJSONFromServer(ims.bagURL);

      expect(response.status).toEqual(200);
      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request).not.toBeJWTAuthenticatedRequest();
    }
  );

  test(
    "_fetchJSONFromServer: authenticated -> OK", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});
      // Clear out request tracking from login
      ims.requestsReceived = [];

      const response = await ims._fetchJSONFromServer(ims.bagURL);

      expect(response.status).toEqual(200);
      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request).toBeJWTAuthenticatedRequest();
    }
  );

  test(
    "_fetchJSONFromServer: not authenticated -> 401 JSON with status",
    async () => {
      const ims = testIncidentManagementSystem();

      const response = await ims._fetchJSONFromServer("/auth_fail_json");

      expect(response.status).toEqual(401);
    }
  );

  test(
    "_fetchJSONFromServer: authenticated -> 401 text", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});
      // Clear out request tracking from login
      ims.requestsReceived = [];

      const response = await ims._fetchJSONFromServer("/auth_fail_json");

      expect(response.status).toEqual(401);
    }
  );

});


describe("IMS: bag", () => {

  test(
    "load bag: request content type", async () => {
      const ims = testIncidentManagementSystem();
      const bag = await ims.bag();

      expect(ims.requestsReceived).toHaveLength(1);

      const request = ims.requestsReceived[0][0];

      expect(request).toBeJSONRequest();
    }
  );

  test(
    "load bag: retrieved urls", async () => {
      const ims = testIncidentManagementSystem();
      const theBag = ims.testData.bag;
      const bag = await ims.bag();

      expect(bag).toBeDefined();
      expect(bag.urls).toBeDefined();

      for (const name in theBag.urls) {
        expect(bag.urls[name]).toEqual(theBag.urls[name]);
      }
    }
  );

  test(
    "load bag twice: unexpired -> one request to server", async () => {
      const ims = testIncidentManagementSystem();
      const bag1 = await ims.bag();
      const bag2 = await ims.bag();

      expect(bag2).toEqual(bag1);
      expect(ims.requestsReceived).toHaveLength(1);
    }
  );

  test(
    "load bag twice: expired -> two requests to server", async () => {
      const ims = testIncidentManagementSystem();

      // Expire the cache immediately
      ims.bagCacheLifetime = { seconds: 0 };

      await ims.bag();
      await ims.bag();

      expect(ims.requestsReceived).toHaveLength(2);
    }
  );

  test(
    "load bag twice: expired, unchanged", async () => {
      const ims = testIncidentManagementSystem();

      ims.bagCacheLifetime = { seconds: 0 };

      const bag1 = await ims.bag();
      const bag2 = await ims.bag();

      expect(bag2).toEqual(bag1);
    }
  );

  test(
    "load bag twice: expired, changed", async () => {
      const ims = testIncidentManagementSystem();

      ims.bagCacheLifetime = { seconds: 0 };

      const bag1 = await ims.bag();

      // Change the server value
      ims.testData.bag.extra = "/extra";

      const bag2 = await ims.bag();

      expect(bag2).not.toEqual(bag1);
      expect(bag2).toEqual(ims.testData.bag);
    }
  );

  test(
    "load cached bag: unexpired", async () => {
      const testBag = { urls: { x: "/x" } }

      const ims = testIncidentManagementSystem();
      const bagStore = new Store("bag", "URL bag");

      bagStore.store(testBag, "1", { seconds: 60 })

      const retrievedBag = await ims.bag();

      // We expect the bag we put in to the cache, and not the one on the server,
      // since it should not have fetched new data.
      expect(retrievedBag).toEqual(testBag);
    }
  );

  test(
    "load cached bag: expired, same ETag", async () => {
      const testBag = { urls: { x: "/x" } }

      const ims = testIncidentManagementSystem();
      const bagStore = new Store("bag", "URL bag");

      // Fetch the bag from the server
      const bag1 = await ims.bag();

      // Get the stored ETag
      const { tag: eTag1 } = bagStore.load();

      // Re-write the cached value with the same ETag and stale expiration
      bagStore.store(testBag, eTag1, { seconds: 0 })

      const bag2 = await ims.bag();

      // We expect use the (re-written) cached bag, given the unchanged ETag on
      // the server.
      expect(bag2).toEqual(testBag);
    }
  );

  test(
    "load cached bag: expired, different ETag", async () => {
      const testBag = { urls: { x: "/x" } }

      const ims = testIncidentManagementSystem();
      const bagStore = new Store("bag", "URL bag");

      // Fetch the bag from the server
      await ims.bag();

      // Re-write the cached value with a new ETag and stale expiration
      bagStore.store(testBag, "1", { seconds: 0 })

      const bag2 = await ims.bag();

      // We expect use the bag from the server, given the non-matching ETag
      expect(bag2).toEqual(ims.testData.bag);
    }
  );

  test(
    "load bag: no URLs in response", async () => {
      const ims = testIncidentManagementSystem();
      ims.bagURL = "/janky_bag";

      const spy = jest.spyOn(console, "error");
      const bag = await ims.bag();

      expect(spy).toHaveBeenCalledWith("Bag does not have URLs: {}");
      expect(bag).toEqualByValue({});
    }
  );

  test(
    "load bag: non-OK response", async () => {
      const ims = testIncidentManagementSystem();
      ims.bagURL = "/forbidden";
      await expect(ims.bag()).toRejectWithMessage("Failed to retrieve URL bag.");
    }
  );

});


describe("IMS: authentication", () => {

  afterEach(() => {
    testIncidentManagementSystem().logout();
  });

  test(
    "login: request content type", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});

      expect(ims.requestsReceived).toHaveLength(2);

      const request = ims.requestsReceived[1][0];

      expect(request).toBeJSONRequest();
    }
  );

  test(
    "login: request body", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});

      expect(ims.requestsReceived).toHaveLength(2);

      const request = ims.requestsReceived[1][0];
      const json = request._json;

      expect(json.identification).toBeDefined();
      expect(json.identification).not.toBeNull();
      expect(json.password).toBeDefined();
      expect(json.password).not.toBeNull();
    }
  );

  test(
    "login -> user", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      const result = await ims.login(username, {password: password});

      expect(result).toBe(true);
      expect(ims.user).not.toBeNull();
    }
  );

  test(
    "login -> auth failed (bad credentials)", async () => {
      const username = "Hubcap";
      const password = "Not My Password";
      const ims = testIncidentManagementSystem();

      const result = await ims.login(username, {password: password});

      expect(result).toBe(false);
      expect(ims.user).toBeNull();
    }
  );

  test(
    "login -> auth failed (non-401)", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      // Need a non-401 error status
      ims.testData.bag.urls.auth = "/forbidden";

      await expect(
        ims.login(username, {password: password})
      ).toRejectWithMessage(
        "Failed to authenticate: HTTP error status 403 Forbidden"
      );
      expect(ims.user).toBeNull();
    }
  );

  test(
    "login -> auth failed (non-JSON)", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      // Need a non-401 error status
      ims.testData.bag.urls.auth = "/auth_fail_text";

      await expect(
        ims.login(username, {password: password})
      ).toRejectWithMessage(
        "Failed to authenticate: non-JSON response for login"
      );
      expect(ims.user).toBeNull();
    }
  );

  test(
    "login -> auth failed (JSON without status)", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      // Need a non-401 error status
      ims.testData.bag.urls.auth = "/auth_fail_json_no_status";

      await expect(
        ims.login(username, {password: password})
      ).toRejectWithMessage(
        "Failed to authenticate: unknown JSON error status: undefined"
      );
      expect(ims.user).toBeNull();
    }
  );

  test(
    "login -> credentials with token", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      const result = await ims.login(username, {password: password});

      expect(result).toBe(true);
      expect(ims.user).not.toBeNull();
      expect(ims.user.credentials.token).toBeTruthy();
    }
  );

  test(
    "login -> result credentials are not expired", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();
      const now = DateTime.local();

      const result = await ims.login(username, {password: password});

      expect(result).toBe(true);
      expect(ims.user).not.toBeNull();
      expect(ims.user.credentials.expiration).toBeAfterDateTime(now);
    }
  );

  test(
    "login: response with different username", async () => {
      const username = "XYZZY";
      const password = username;
      const ims = testIncidentManagementSystem();

      const result = await ims.login(username, {password: password});

      expect(result).toBe(true);
      expect(ims.user.username).toEqual("Cretin");
    }
  );

  test(
    "login: response with no token", async () => {
      const username = "No Token";
      const password = username;
      const ims = testIncidentManagementSystem();

      await expect(
        ims.login(username, {password: password})
      ).toRejectWithMessage("No token in retrieved credentials");
    }
  );

  test(
    "login: response with no expiration", async () => {
      const username = "Forever";
      const password = username;
      const ims = testIncidentManagementSystem();

      await expect(
        ims.login(username, {password: password})
      ).toRejectWithMessage("No expiration in retrieved credentials");
    }
  );

  test(
    "login -> user -> logout", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});

      const result = await ims.logout();

      expect(result).toBe(true);
    }
  );

  test(
    "isLoggedIn(), not logged in", async () => {
      const ims = testIncidentManagementSystem();

      expect(ims.isLoggedIn()).toBe(false);
    }
  );

  test(
    "isLoggedIn(), logged in", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});

      expect(ims.isLoggedIn()).toBe(true);
    }
  );

  test(
    "isLoggedIn(), missing expiration", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});

      delete ims.user.credentials.expiration;

      expect(ims.isLoggedIn()).toBe(false);
    }
  );

  test(
    "isLoggedIn(), expired", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});

      ims.user.credentials.expiration = DateTime.local().minus({ seconds: 1 });

      expect(ims.isLoggedIn()).toBe(false);
    }
  );

  test(
    "login -> notify delegate", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      let notified = false;
      ims.delegate = () => { notified = true; }

      const result = await ims.login(username, {password: password});

      expect(notified).toBe(true);
    }
  );

  test(
    "logout -> notify delegate", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});

      let notified = false;
      ims.delegate = () => { notified = true; }

      await ims.logout();

      expect(notified).toBe(true);
    }
  );

  test(
    "login -> stored", async () => {
      const username = "Hubcap";
      const password = username;
      const ims1 = testIncidentManagementSystem();

      await ims1.login(username, {password: password});

      const ims2 = testIncidentManagementSystem();

      expect(ims2.user.toJSON()).toEqual(ims2.user.toJSON());
    }
  );

  test(
    "logout -> stored", async () => {
      const username = "Hubcap";
      const password = username;
      const ims = testIncidentManagementSystem();

      await ims.login(username, {password: password});
      await ims.logout();

      const ims2 = testIncidentManagementSystem();

      expect(ims2.user).toBeNull();
    }
  );

});


describe("IMS: events", () => {

  afterEach(() => {
    testIncidentManagementSystem().logout();
  });

  test(
    "local events, ok", async () => {
      const ims = await testIncidentManagementSystem().asHubcap();

      const events = await ims.events();

      expect(events.map((event) => event.toJSON())).toEqual(ims.testData.events);
    }
  );

  test(
    "load events, failed", async () => {
      const ims = await testIncidentManagementSystem();
      ims.testData.bag.urls.events = "/forbidden";
      ims.asHubcap();

      await expect(ims.events()).toRejectWithMessage(
        "Failed to retrieve event list."
      );
    }
  );

  test(
    "load events twice: unexpired -> one request to server", async () => {
      const ims = testIncidentManagementSystem();

      // Fetch bag now and discount the requests made to get it
      await ims.bag();
      let eventRequestCount = 0 - ims.requestsReceived.length;

      const events1 = await ims.events();
      const events2 = await ims.events();

      eventRequestCount += ims.requestsReceived.length;

      expect(events2).toEqualByValue(events1);
      expect(eventRequestCount).toEqual(1);
    }
  );

  test(
    "load events twice: expired -> two requests to server", async () => {
      const ims = testIncidentManagementSystem();

      // Fetch bag now and discount the requests made to get it
      await ims.bag();
      let eventRequestCount = 0 - ims.requestsReceived.length;

      // Expire the cache immediately
      ims.eventsCacheLifetime = { seconds: 0 };

      await ims.events();
      await ims.events();

      eventRequestCount += ims.requestsReceived.length;

      expect(eventRequestCount).toEqual(2);
    }
  );

  test(
    "load events twice: expired, unchanged", async () => {
      const ims = testIncidentManagementSystem();

      ims.eventsCacheLifetime = { seconds: 0 };

      const events1 = await ims.events();
      const events2 = await ims.events();

      expect(events2).toEqualByValue(events1);
    }
  );

  test(
    "eventWithID: found", async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        expect(await ims.eventWithID(event.id)).toEqualByValue(event);
      }
    }
  );

  test(
    "eventWithID: not found", async () => {
      const ims = testIncidentManagementSystem();
      const id = "XYZZY";

      expect(ims.eventWithID(id)).toRejectWithMessage(
        `No event found with ID: ${id}`
      );
    }
  );

});
