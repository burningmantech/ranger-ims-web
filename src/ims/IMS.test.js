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
    const url = new URL("https://localhost/ims/api/bag");
    const ims = new IncidentManagementSystem(url);

    expect(ims.bagURL).toEqual(url);
  });

  test("bagURL may not be empty string", () => {
    const message = "bagURL must be URL";

    expect(() => {new IncidentManagementSystem("")}).toThrow(message);
  });

  test("initial state", () => {
    const url = new URL("https://localhost/ims/api/bag");
    const ims = new IncidentManagementSystem(url);

    expect(ims._bag).toBeNull();
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

  test("login: username may not be undefined", async () => {
    const message = "username is required";
    const ims = testIncidentManagementSystem();

    await expect(ims.login()).toRejectWithMessage(message);
  });

  test("login: username may not be null", async () => {
    const message = "username is required";
    const ims = testIncidentManagementSystem();

    await expect(ims.login(null)).toRejectWithMessage(message);
  });

  test("login: credentials may not be undefined", async () => {
    const username = "Hubcap"
    const message = "credentials is required";
    const ims = testIncidentManagementSystem();

    await expect(ims.login(username)).toRejectWithMessage(message);
  });

  test("login: credentials may not be null", async () => {
    const username = "Hubcap"
    const message = "credentials is required";
    const ims = testIncidentManagementSystem();

    await expect(ims.login(username, null)).toRejectWithMessage(message);
  });

  test("login: request content type", async () => {
    const username = "Hubcap"
    const password = username
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    expect(ims.requestsReceived).toHaveLength(2);

    const request = ims.requestsReceived[1];

    expect(request).toBeJSONRequest();
  });

  // test("login: request user & password", async () => {
  //   const username = "Hubcap"
  //   const password = username
  //   const ims = testIncidentManagementSystem();

  //   await ims.login(username, {password: password});

  //   expect(ims.requestsReceived).toHaveLength(2);

  //   const request = ims.requestsReceived[1];
  //   const json = await request.json();

  //   expect(json.username).toBeDefined();
  //   expect(json.username).not.toBeNull();
  //   expect(json.password).toBeDefined();
  //   expect(json.password).not.toBeNull();
  // });

  test("login -> user", async () => {
    const username = "Hubcap"
    const password = username
    const ims = testIncidentManagementSystem();
    const now = moment();

    await ims.login(username, {password: password});

    expect(ims.user).not.toBeNull();
  });

  test("login -> credentials with token", async () => {
    const username = "Hubcap"
    const password = username
    const ims = testIncidentManagementSystem();

    await ims.login(username, {password: password});

    expect(ims.user).not.toBeNull();
    expect(ims.user.credentials.token).toBeTruthy();
  });

  test("login -> credentials not expired", async () => {
    const username = "Hubcap"
    const password = username
    const ims = testIncidentManagementSystem();
    const now = moment();

    await ims.login(username, {password: password});

    expect(ims.user).not.toBeNull();
    expect(ims.user.credentials.expiration).toBeAfterMoment(now);
  });

});
