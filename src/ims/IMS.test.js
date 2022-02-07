import { DateTime } from "luxon";

import Store from "./Store";
import IncidentManagementSystem from "./IMS";
import { testIncidentManagementSystem } from "./TestIMS";
import Location from "./model/Location";
import RodGarettAddress from "./model/RodGarettAddress";

expect.extend({
  toBeJSONRequest(request) {
    if (!request.headers.has("Content-Type")) {
      return {
        message: () => "Request has no Content-Type header",
        pass: false,
      };
    }

    const contentType = request.headers.get("Content-Type");
    if (contentType !== "application/json") {
      return {
        message: () => `Request Content-Type is not JSON: ${contentType}`,
        pass: false,
      };
    }

    return {
      message: () => "Request is a JSON request",
      pass: true,
    };
  },

  toBeJWTAuthenticatedRequest(request) {
    if (!request.headers.has("Authorization")) {
      return {
        message: () => "Request has no Authorization header",
        pass: false,
      };
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization.startsWith("Bearer ")) {
      return {
        message: () =>
          `Request authorization lacks bearer token: ${authorization}`,
        pass: false,
      };
    }

    return {
      message: () => "Request has authorization with bearer token",
      pass: true,
    };
  },
});

describe("IMS: init", () => {
  test("bagURL", () => {
    const url = "/ims/api/bag";
    const ims = new IncidentManagementSystem(url);

    expect(ims.bagURL).toEqual(url);
  });

  test("initial state", () => {
    const url = "/ims/api/bag";
    const ims = new IncidentManagementSystem(url);

    expect(ims.bagURL).toEqual(url);
    expect(ims.delegate).toBeNull();
    expect(ims.user).toBeNull();
    expect(ims._credentialStore).not.toBeNull();
  });

  test("_incidentsStore", () => {
    const url = "/ims/api/bag";
    const ims = new IncidentManagementSystem(url);
    const eventID = "XYZZY";

    expect(ims._incidentsStoreByEvent[eventID]).toBeUndefined();
    const store1 = ims._incidentsStore(eventID);
    const store2 = ims._incidentsStore(eventID);
    expect(store1).toBe(store2);
  });
});

describe("IMS: HTTP requests", () => {
  test("_fetchJSONFromServer: default content type", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer(ims.bagURL);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request).toBeJSONRequest();
  });

  test("_fetchJSONFromServer: JSON content type given", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer(ims.bagURL, {
      headers: { "Content-Type": "application/json" },
    });

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request).toBeJSONRequest();
  });

  test("_fetchJSONFromServer: JSON content type not given", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer(ims.bagURL);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request).toBeJSONRequest();
  });

  test("_fetchJSONFromServer: non-JSON content type", async () => {
    const ims = testIncidentManagementSystem();

    expect(
      ims._fetchJSONFromServer(ims.bagURL, {
        headers: { "Content-Type": "text/plain" },
      })
    ).toRejectWithMessage("Not JSON content-type: text/plain");
  });

  test("_fetchJSONFromServer: string with full URL", async () => {
    const url = "https://localhost/ims/api/bag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer(url);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request.url).toEqual(url);
  });

  test("_fetchJSONFromServer: string with path URL", async () => {
    const url = "/ims/api/bag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer(url);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request.url).toEqual(url);
  });

  test("_fetchJSONFromServer: with no JSON -> GET request", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer(ims.bagURL);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request.method).toEqual("GET");
  });

  test("_fetchJSONFromServer: with JSON -> POST request", async () => {
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer("/json_echo", { json: {} });

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request.method).toEqual("POST");
  });

  test("_fetchJSONFromServer: non-JSON response -> OK", async () => {
    const ims = testIncidentManagementSystem();

    await expect(ims._fetchJSONFromServer("/text_hello")).toRejectWithMessage(
      "Response type is not JSON: text/plain"
    );
  });

  test("_fetchJSONFromServer: non-JSON response -> non-OK", async () => {
    const ims = testIncidentManagementSystem();

    const response = await ims._fetchJSONFromServer("/not_found");

    expect(response.status).toEqual(404);
  });

  test("_fetchJSONFromServer: ETag with GET -> If-None-Match header", async () => {
    const eTag = "test-ETag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer(ims.bagURL, { eTag: eTag });

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request.headers.get("If-None-Match")).toEqual(eTag);
  });

  test("_fetchJSONFromServer: ETag with POST -> If-Match header", async () => {
    const eTag = "test-ETag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSONFromServer("/json_echo", { json: {}, eTag: eTag });

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request.headers.get("If-Match")).toEqual(eTag);
  });

  test("_fetchJSONFromServer: not authenticated -> OK", async () => {
    const ims = testIncidentManagementSystem();

    const response = await ims._fetchJSONFromServer(ims.bagURL);

    expect(response.status).toEqual(200);
    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request).not.toBeJWTAuthenticatedRequest();
  });

  test("_fetchJSONFromServer: authenticated -> OK", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });
    // Clear out request tracking from login
    ims.requestsReceived = [];

    const response = await ims._fetchJSONFromServer(ims.bagURL);

    expect(response.status).toEqual(200);
    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

    expect(request).toBeJWTAuthenticatedRequest();
  });

  test("_fetchJSONFromServer: not authenticated -> 401 JSON with status", async () => {
    const ims = testIncidentManagementSystem();

    const response = await ims._fetchJSONFromServer("/auth_fail_json");

    expect(response.status).toEqual(401);
  });

  test("_fetchJSONFromServer: authenticated -> 401 text", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });
    // Clear out request tracking from login
    ims.requestsReceived = [];

    const response = await ims._fetchJSONFromServer("/auth_fail_json");

    expect(response.status).toEqual(401);
  });
});

describe("IMS: bag", () => {
  test("load bag: request content type", async () => {
    const ims = testIncidentManagementSystem();

    await ims.bag();

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0][0];

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

  test("load bag twice: unexpired -> one request to server", async () => {
    const ims = testIncidentManagementSystem();
    const bag1 = await ims.bag();
    const bag2 = await ims.bag();

    expect(bag2).toEqual(bag1);
    expect(ims.requestsReceived).toHaveLength(1);
  });

  test("load bag twice: expired -> two requests to server", async () => {
    const ims = testIncidentManagementSystem();

    // Expire the cache immediately
    ims.bagCacheLifespan = { seconds: 0 };

    await ims.bag();
    await ims.bag();

    expect(ims.requestsReceived).toHaveLength(2);
  });

  test("load bag twice: expired, unchanged", async () => {
    const ims = testIncidentManagementSystem();

    ims.bagCacheLifespan = { seconds: 0 };

    const bag1 = await ims.bag();
    const bag2 = await ims.bag();

    expect(bag2).toEqual(bag1);
  });

  test("load bag twice: expired, changed", async () => {
    const ims = testIncidentManagementSystem();

    ims.bagCacheLifespan = { seconds: 0 };

    const bag1 = await ims.bag();

    // Change the server value
    ims.testData.bag.extra = "/extra";

    const bag2 = await ims.bag();

    expect(bag2).not.toEqual(bag1);
    expect(bag2).toEqual(ims.testData.bag);
  });

  test("load cached bag: unexpired", async () => {
    const testBag = { urls: { x: "/x" } };

    const ims = testIncidentManagementSystem();
    const bagStore = new Store(null, "bag", "bag");

    bagStore.store(testBag, "1", { seconds: 60 });

    const retrievedBag = await ims.bag();

    // We expect the bag we put in to the cache, and not the one on the server,
    // since it should not have fetched new data.
    expect(retrievedBag).toEqual(testBag);
  });

  test("load cached bag: expired, same ETag", async () => {
    const testBag = { urls: { x: "/x" } };

    const ims = testIncidentManagementSystem();
    const bagStore = new Store(null, "bag", "bag");

    // Fetch the bag from the server
    await ims.bag();

    // Get the stored ETag
    const { tag: eTag1 } = bagStore.load();

    // Re-write the cached value with the same ETag and stale expiration
    bagStore.store(testBag, eTag1, { seconds: 0 });

    const bag = await ims.bag();

    // We expect use the (re-written) cached bag, given the unchanged ETag on
    // the server.
    expect(bag).toEqual(testBag);
  });

  test("load cached bag: expired, different ETag", async () => {
    const testBag = { urls: { x: "/x" } };

    const ims = testIncidentManagementSystem();
    const bagStore = new Store(null, "bag", "bag");

    // Fetch the bag from the server
    await ims.bag();

    // Re-write the cached value with a new ETag and stale expiration
    bagStore.store(testBag, "1", { seconds: 0 });

    const bag2 = await ims.bag();

    // We expect use the bag from the server, given the non-matching ETag
    expect(bag2).toEqual(ims.testData.bag);
  });

  test("load bag: non-OK response", async () => {
    const ims = testIncidentManagementSystem();
    ims.bagURL = "/forbidden";
    await expect(ims.bag()).toRejectWithMessage("Failed to retrieve bag.");
  });
});

describe("IMS: authentication", () => {
  afterEach(() => {
    // Reset cached data
    Store.removeAll();
  });

  test("login: request content type", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });

    expect(ims.requestsReceived).toHaveLength(2);

    const request = ims.requestsReceived[1][0];

    expect(request).toBeJSONRequest();
  });

  test("login: request body", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });

    expect(ims.requestsReceived).toHaveLength(2);

    const request = ims.requestsReceived[1][0];
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

    const result = await ims.login(username, { password: password });

    expect(result).toBe(true);
    expect(ims.user).not.toBeNull();
  });

  test("login -> auth failed (bad credentials)", async () => {
    const username = "Hubcap";
    const password = "Not My Password";
    const ims = testIncidentManagementSystem();

    const result = await ims.login(username, { password: password });

    expect(result).toBe(false);
    expect(ims.user).toBeNull();
  });

  test("login -> auth failed (non-401)", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    // Need a non-401 error status
    ims.testData.bag.urls.auth = "/forbidden";

    await expect(
      ims.login(username, { password: password })
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
    ims.testData.bag.urls.auth = "/auth_fail_text";

    await expect(
      ims.login(username, { password: password })
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
    ims.testData.bag.urls.auth = "/auth_fail_json_no_status";

    await expect(
      ims.login(username, { password: password })
    ).toRejectWithMessage(
      "Failed to authenticate: unknown JSON error status: undefined"
    );
    expect(ims.user).toBeNull();
  });

  test("login -> credentials with token", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    const result = await ims.login(username, { password: password });

    expect(result).toBe(true);
    expect(ims.user).not.toBeNull();
    expect(ims.user.credentials.token).toBeTruthy();
  });

  test("login -> result credentials are not expired", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();
    const now = DateTime.local();

    const result = await ims.login(username, { password: password });

    expect(result).toBe(true);
    expect(ims.user).not.toBeNull();
    expect(ims.user.credentials.expiration).toBeAfterDateTime(now);
  });

  test("login: response with different username", async () => {
    const username = "XYZZY";
    const password = username;
    const ims = testIncidentManagementSystem();

    const result = await ims.login(username, { password: password });

    expect(result).toBe(true);
    expect(ims.user.username).toEqual("Cretin");
  });

  test("login: response with no token", async () => {
    const username = "No Token";
    const password = username;
    const ims = testIncidentManagementSystem();

    await expect(
      ims.login(username, { password: password })
    ).toRejectWithMessage("No token in retrieved credentials");
  });

  test("login: response with no expiration", async () => {
    const username = "Forever";
    const password = username;
    const ims = testIncidentManagementSystem();

    await expect(
      ims.login(username, { password: password })
    ).toRejectWithMessage("No expiration in retrieved credentials");
  });

  test("login -> user -> logout", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });

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

    await ims.login(username, { password: password });

    expect(ims.isLoggedIn()).toBe(true);
  });

  test("isLoggedIn(), missing expiration", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });

    delete ims.user.credentials.expiration;

    expect(ims.isLoggedIn()).toBe(false);
  });

  test("isLoggedIn(), expired", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });

    ims.user.credentials.expiration = DateTime.local().minus({ seconds: 1 });

    expect(ims.isLoggedIn()).toBe(false);
  });

  test("login -> notify delegate", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    let notified = false;
    ims.delegate = () => {
      notified = true;
    };

    await ims.login(username, { password: password });

    expect(notified).toBe(true);
  });

  test("logout -> notify delegate", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });

    let notified = false;
    ims.delegate = () => {
      notified = true;
    };

    await ims.logout();

    expect(notified).toBe(true);
  });

  test("login -> stored", async () => {
    const username = "Hubcap";
    const password = username;
    const ims1 = testIncidentManagementSystem();

    await ims1.login(username, { password: password });

    const ims2 = testIncidentManagementSystem();

    expect(ims2.user.toJSON()).toEqual(ims2.user.toJSON());
  });

  test("logout -> stored", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, { password: password });
    await ims.logout();

    const ims2 = testIncidentManagementSystem();

    expect(ims2.user).toBeNull();
  });
});

describe("IMS: events", () => {
  afterEach(() => {
    // Reset cached data
    Store.removeAll();
  });

  test("load events, ok", async () => {
    const ims = await testIncidentManagementSystem().asHubcap();

    const events = await ims.events();

    expect(events.map((event) => event.toJSON())).toEqual(ims.testData.events);
  });

  test("load events, failed", async () => {
    const ims = await testIncidentManagementSystem();
    ims.testData.bag.urls.events = "/forbidden";
    ims.asHubcap();

    await expect(ims.events()).toRejectWithMessage(
      "Failed to retrieve events."
    );
  });

  test("load events twice: unexpired -> one request to server", async () => {
    const ims = testIncidentManagementSystem();

    // Fetch bag now and discount the requests made to get it
    await ims.bag();
    let requestCount = 0 - ims.requestsReceived.length;

    const events1 = await ims.events();
    const events2 = await ims.events();

    requestCount += ims.requestsReceived.length;

    expect(events2).toEqualByValue(events1);
    expect(requestCount).toEqual(1);
  });

  test("load events twice: expired -> two requests to server", async () => {
    const ims = testIncidentManagementSystem();

    // Fetch bag now and discount the requests made to get it
    await ims.bag();
    let requestCount = 0 - ims.requestsReceived.length;

    // Expire the cache immediately
    ims.eventsCacheLifespan = { seconds: 0 };

    await ims.events();
    await ims.events();

    requestCount += ims.requestsReceived.length;

    expect(requestCount).toEqual(2);
  });

  test("load events twice: expired, unchanged", async () => {
    const ims = testIncidentManagementSystem();

    ims.eventsCacheLifespan = { seconds: 0 };

    const events1 = await ims.events();
    const events2 = await ims.events();

    expect(events2).toEqualByValue(events1);
  });

  test("eventWithID: found", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      expect(await ims.eventWithID(event.id)).toEqualByValue(event);
    }
  });

  test("eventWithID: not found", async () => {
    const ims = testIncidentManagementSystem();
    const id = "XYZZY";

    expect(ims.eventWithID(id)).toRejectWithMessage(
      `No event found with ID: ${id}`
    );
  });
});

describe("IMS: incidents", () => {
  afterEach(() => {
    // Reset cached data
    Store.removeAll();
  });

  test("load incidents, ok", async () => {
    const ims = await testIncidentManagementSystem().asHubcap();

    const mapIncidentsByNumber = (incidents) => {
      return new Map(incidents.map((incident) => [incident.number, incident]));
    };

    for (const event of await ims.events()) {
      const retrievedIncidents = await ims.incidents(event.id);
      const retrievedIncidentsByNumber =
        mapIncidentsByNumber(retrievedIncidents);
      const expectedIncidentsByNumber = mapIncidentsByNumber(
        ims.testData.incidents[event.id]
      );

      // Incident numbers should be the same
      expect(Array.from(retrievedIncidentsByNumber.keys()).sort()).toEqual(
        Array.from(expectedIncidentsByNumber.keys()).sort()
      );

      // FIXME: need a good way to compare incidents
      // // Incidents should match
      // for (const retrievedIncident of retrievedIncidents) {
      //   expect(retrievedIncident.toJSON()).toEqual(
      //     expectedIncidentsByNumber.get(retrievedIncident.number)
      //   );
      // }
    }
  });

  test("load incidents, failed", async () => {
    const ims = await testIncidentManagementSystem();
    ims.testData.bag.urls.incidents = "/forbidden";
    ims.asHubcap();

    await expect(ims.incidents("1")).toRejectWithMessage(
      "Failed to retrieve incidents:1."
    );
  });

  test("load incidents twice: unexpired -> one request to server", async () => {
    const ims = testIncidentManagementSystem();

    // Fetch bag now and discount the requests made to get it
    await ims.bag();
    let requestCount = 0 - ims.requestsReceived.length;

    const incidents1 = await ims.incidents("1");
    const incidents2 = await ims.incidents("1");

    requestCount += ims.requestsReceived.length;

    expect(incidents2).toEqualByValue(incidents1);
    expect(requestCount).toEqual(1);
  });

  test("load incidents twice: expired, unchanged", async () => {
    const ims = testIncidentManagementSystem();

    ims.incidentsCacheLifespan = { seconds: 0 };

    const incidents1 = await ims.incidents("1");
    const incidents2 = await ims.incidents("1");

    expect(incidents2).toEqualByValue(incidents1);
  });

  test("incidentWithNumber: found", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        expect(
          await ims.incidentWithNumber(event.id, incident.number)
        ).toEqualByValue(incident);
      }
    }
  });

  test("incidentWithNumber: not found", async () => {
    const ims = testIncidentManagementSystem();
    const number = -1;

    for (const event of await ims.events()) {
      expect(ims.incidentWithNumber(event.id, number)).toRejectWithMessage(
        `No incident found with event:number: ${event.id}:${number}`
      );
    }
  });
});

const search = async (ims, event, query) => {
  const incidents = await ims.search(event.id, query);
  return new Set(incidents.map((incident) => incident.number));
};

describe("IMS: search", () => {
  test("search by number", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    await ims.addMoreIncidents(event.id, 200);

    expect(await search(ims, event, "167")).toEqual(new Set([167]));
    expect(await search(ims, event, "139")).toEqual(new Set([139]));
  });

  test("search by created", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    // 1 - Sunday 10:10
    await ims.addIncidentWithFields(event.id, {
      created: DateTime.fromISO("2022-01-16T10:10Z"),
    });
    // 2 - Sunday 10:11
    await ims.addIncidentWithFields(event.id, {
      created: DateTime.fromISO("2022-01-16T10:11Z"),
    });
    // 3 - Sunday 11:10
    await ims.addIncidentWithFields(event.id, {
      created: DateTime.fromISO("2022-01-16T11:10Z"),
    });
    // 4 - Wednesday 20:10
    await ims.addIncidentWithFields(event.id, {
      created: DateTime.fromISO("2022-01-19T20:10Z"),
    });
    // 5 - Friday 08:00
    await ims.addIncidentWithFields(event.id, {
      created: DateTime.fromISO("2022-01-21T08:00Z"),
    });

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "Sunday")).toEqual(new Set([1, 2, 3]));
    expect(await search(ims, event, "Wednesday")).toEqual(new Set([4]));
    expect(await search(ims, event, "Friday")).toEqual(new Set([5]));

    // Partial words - forward
    expect(await search(ims, event, "Sun")).toEqual(new Set([1, 2, 3]));
    expect(await search(ims, event, "Wed")).toEqual(new Set([4]));
    expect(await search(ims, event, "11:")).toEqual(new Set([2, 3]));
  });

  test("search by state", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    await ims.addIncidentWithFields(event.id, { state: "closed" }); // 1
    await ims.addIncidentWithFields(event.id, { state: "on_hold" }); // 2
    await ims.addIncidentWithFields(event.id, { state: "new" }); // 3
    await ims.addIncidentWithFields(event.id, { state: "dispatched" }); // 4
    await ims.addIncidentWithFields(event.id, { state: "dispatched" }); // 5
    await ims.addIncidentWithFields(event.id, { state: "new" }); // 6
    await ims.addIncidentWithFields(event.id, { state: "on_scene" }); // 7

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "new")).toEqual(new Set([3, 6]));
    expect(await search(ims, event, "on hold")).toEqual(new Set([2]));
    expect(await search(ims, event, "dispatched")).toEqual(new Set([4, 5]));
    expect(await search(ims, event, "on scene")).toEqual(new Set([7]));
    expect(await search(ims, event, "closed")).toEqual(new Set([1]));
  });

  test("search by priority", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    await ims.addIncidentWithFields(event.id, { priority: 1 }); // 1
    await ims.addIncidentWithFields(event.id, { priority: 2 }); // 2
    await ims.addIncidentWithFields(event.id, { priority: 3 }); // 3
    await ims.addIncidentWithFields(event.id, { priority: 4 }); // 4
    await ims.addIncidentWithFields(event.id, { priority: 5 }); // 5

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "low")).toEqual(new Set([4, 5]));
    expect(await search(ims, event, "normal")).toEqual(new Set([3]));
    expect(await search(ims, event, "high")).toEqual(new Set([1, 2]));
  });

  test("search by summary", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    await ims.addIncidentWithFields(event.id, { summary: "Cat in tree" }); // 1
    await ims.addIncidentWithFields(event.id, { summary: "Dog in house" }); // 2
    await ims.addIncidentWithFields(event.id, { summary: "Cat in house" }); // 3

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "tree")).toEqual(new Set([1]));
    expect(await search(ims, event, "house")).toEqual(new Set([2, 3]));
    expect(await search(ims, event, "cat")).toEqual(new Set([1, 3]));
    expect(await search(ims, event, "dog")).toEqual(new Set([2]));
    expect(await search(ims, event, "dog in house")).toEqual(new Set([2]));
    expect(await search(ims, event, "dog in tree")).toEqual(new Set([]));
    expect(await search(ims, event, "dog tree")).toEqual(new Set([]));
    expect(await search(ims, event, "turtle")).toEqual(new Set([]));

    // Partial words - forward
    expect(await search(ims, event, "tr")).toEqual(new Set([1]));

    // Partial words - reverse
    expect(await search(ims, event, "ho og")).toEqual(new Set([2]));

    // Partial words - full
    expect(await search(ims, event, "e")).toEqual(new Set([1, 2, 3]));
  });

  test("search by location name", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    // 1
    await ims.addIncidentWithFields(event.id, {
      location: new Location({ name: "Log-Pile House" }),
    });
    // 2
    await ims.addIncidentWithFields(event.id, {
      location: new Location({ name: "Treetop House" }),
    });
    // 3
    await ims.addIncidentWithFields(event.id, {
      location: new Location({ name: "Underground House" }),
    });

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "log-pile")).toEqual(new Set([1]));
    expect(await search(ims, event, "treetop")).toEqual(new Set([2]));
    expect(await search(ims, event, "underground")).toEqual(new Set([3]));
    expect(await search(ims, event, "house")).toEqual(new Set([1, 2, 3]));

    // Partial words - forward
    expect(await search(ims, event, "Log-")).toEqual(new Set([1]));
    expect(await search(ims, event, "Tree")).toEqual(new Set([2]));

    // Partial words - reverse
    expect(await search(ims, event, "og ile")).toEqual(new Set([1]));
    expect(await search(ims, event, "use")).toEqual(new Set([1, 2, 3]));

    // Partial words - full
    expect(await search(ims, event, "ou")).toEqual(new Set([1, 2, 3]));
  });

  test("search by location address description", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    // 1
    await ims.addIncidentWithFields(event.id, {
      location: new Location({
        address: new RodGarettAddress({
          description: "Here, by this lake...",
        }),
      }),
    });
    // 2
    await ims.addIncidentWithFields(event.id, {
      location: new Location({
        address: new RodGarettAddress({
          description: "Here, by this stream...",
        }),
      }),
    });
    // 3
    await ims.addIncidentWithFields(event.id, {
      location: new Location({
        address: new RodGarettAddress({
          description: "Here, by these rocks...",
        }),
      }),
    });

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "lake")).toEqual(new Set([1]));
    expect(await search(ims, event, "stream")).toEqual(new Set([2]));
    expect(await search(ims, event, "rocks")).toEqual(new Set([3]));
    expect(await search(ims, event, "here")).toEqual(new Set([1, 2, 3]));

    // Partial words - forward
    expect(await search(ims, event, "lak")).toEqual(new Set([1]));
    expect(await search(ims, event, "st")).toEqual(new Set([2]));

    // Partial words - reverse
    expect(await search(ims, event, "ake")).toEqual(new Set([1]));
    expect(await search(ims, event, "ere")).toEqual(new Set([1, 2, 3]));

    // Partial words - full
    expect(await search(ims, event, "er")).toEqual(new Set([1, 2, 3]));
  });

  test("search by incident types", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    // 1
    await ims.addIncidentWithFields(event.id, { incidentTypes: [] });
    // 2
    await ims.addIncidentWithFields(event.id, {
      incidentTypes: ["Housebound Dogs"],
    });
    // 3
    await ims.addIncidentWithFields(event.id, {
      incidentTypes: ["Treebound Cats"],
    });
    // 4
    await ims.addIncidentWithFields(event.id, {
      incidentTypes: ["Housebound Dogs", "Treebound Cats"],
    });

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "Housebound Dogs")).toEqual(
      new Set([2, 4])
    );
    expect(await search(ims, event, "Housebound")).toEqual(new Set([2, 4]));
    expect(await search(ims, event, "Treebound Cats")).toEqual(new Set([3, 4]));
    expect(await search(ims, event, "Cats")).toEqual(new Set([3, 4]));
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Partial words - forward
    expect(await search(ims, event, "House")).toEqual(new Set([2, 4]));
  });

  test("search by ranger handles", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    // 1
    await ims.addIncidentWithFields(event.id, { rangerHandles: [] });
    // 2
    await ims.addIncidentWithFields(event.id, { rangerHandles: ["Bucket"] });
    // 3
    await ims.addIncidentWithFields(event.id, { rangerHandles: ["Hubcap"] });
    // 4
    await ims.addIncidentWithFields(event.id, {
      rangerHandles: ["Bucket", "Hubcap"],
    });

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "Bucket")).toEqual(new Set([2, 4]));
    expect(await search(ims, event, "Hubcap")).toEqual(new Set([3, 4]));
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Partial words - forward
    expect(await search(ims, event, "Buck")).toEqual(new Set([2, 4]));

    // Partial words - reverse
    expect(await search(ims, event, "cap")).toEqual(new Set([3, 4]));

    // Partial words - full
    expect(await search(ims, event, "uck")).toEqual(new Set([2, 4]));
  });

  test("search by multiple fields", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    // 1
    await ims.addIncidentWithFields(event.id, {
      summary: "Bucket fell on angry dude",
    });
    // 2
    await ims.addIncidentWithFields(event.id, { rangerHandles: ["Bucket"] });
    // 3
    await ims.addIncidentWithFields(event.id, { rangerHandles: ["Hubcap"] });

    // No result
    expect(await search(ims, event, "XYZZY")).toEqual(new Set([]));

    // Full words
    expect(await search(ims, event, "Bucket")).toEqual(new Set([1, 2]));
    expect(await search(ims, event, "Hubcap")).toEqual(new Set([3]));
  });
});
