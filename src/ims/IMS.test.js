import moment from "moment";

import IncidentManagementSystem from "./IMS";
import {
  TestIncidentManagementSystem, testIncidentManagementSystem, theBag
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

});


describe("IMS", () => {

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

    expect(ims._bag).toBeNull();
  });

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
      ims.bagURL, null, { "Content-Type": "application/json" }
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
    const message = "Not JSON content-type: text/plain";
    const ims = testIncidentManagementSystem();

    expect(
      ims._fetchJSON(ims.bagURL, null, { "Content-Type": "text/plain" })
    ).toRejectWithMessage(message);
  });

  test("_fetchJSON: string full URL", async () => {
    const url = "https://localhost/ims/api/bag";
    const ims = testIncidentManagementSystem();

    await ims._fetchJSON(url);

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request.url).toEqual(url);
  });

  test("_fetchJSON: string path URL", async () => {
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

    await ims._fetchJSON("/echo_json", {});

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request.method).toEqual("POST");
  });

  test("_fetchJSON: non-JSON response", async () => {
    const message = "Response type is not JSON: text/plain";
    const ims = testIncidentManagementSystem();

    await expect(ims._fetchJSON("/none")).toRejectWithMessage(message);
  });

  test("load bag: request content type", async () => {
    const ims = testIncidentManagementSystem();
    const bag = await ims.bag();

    expect(ims.requestsReceived).toHaveLength(1);

    const request = ims.requestsReceived[0];

    expect(request).toBeJSONRequest();
  });

  test("load bag: retrieved urls", async () => {
    const now = moment();
    const ims = testIncidentManagementSystem();
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
    const message = "Bag does not have URLs: {}";
    const ims = testIncidentManagementSystem("/janky_bag");
    await expect(ims.bag()).toRejectWithMessage(message);
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
    const now = moment();

    await ims.login(username, {password: password});

    expect(ims.user).not.toBeNull();
  });

  test("login -> credentials with token", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    expect(ims.user).not.toBeNull();
    expect(ims.user.credentials.token).toBeTruthy();
  });

  test("login -> credentials not expired", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();
    const now = moment();

    await ims.login(username, {password: password});

    expect(ims.user).not.toBeNull();
    expect(ims.user.credentials.expiration).toBeAfterMoment(now);
  });

  test("login: response with different username", async () => {
    const username = "XYZZY";
    const password = username;
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    expect(ims.user.username).toEqual("Cretin");
  });

  test("login: response with no token", async () => {
    const message = "No token in retrieved credentials";
    const username = "No Token";
    const password = username;
    const ims = testIncidentManagementSystem();

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage(message);
  });

  test("login: response with no expiration", async () => {
    const message = "No expiration in retrieved credentials";
    const username = "Forever";
    const password = username;
    const ims = testIncidentManagementSystem();

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage(message);
  });

  test("login: response with invalid expiration", async () => {
    const message = (
      "Invalid expiration in retrieved credentials: Whenever you like, dude."
    );
    const username = "Friend of Larry";
    const password = username;
    const ims = testIncidentManagementSystem();

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage(message);
  });

  test("login: response with invalid expiration", async () => {
    const message = (
      "Invalid expiration in retrieved credentials: Whenever you like, dude."
    );
    const username = "Friend of Larry";
    const password = username;
    const ims = testIncidentManagementSystem();

    await expect(
      ims.login(username, {password: password})
    ).toRejectWithMessage(message);
  });

  test("login -> user -> logout", async () => {
    const username = "Hubcap";
    const password = username;
    const ims = testIncidentManagementSystem();
    const now = moment();

    await ims.login(username, {password: password});

    const result = await ims.logout();

    expect(result).toBe(true);
  });

});
