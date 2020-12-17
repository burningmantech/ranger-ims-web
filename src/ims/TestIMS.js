import jwtSign from "jsonwebtoken/sign";
import moment from "moment";

import User from "./User";
import IncidentManagementSystem from "./IMS";
import { IMSContext } from "./context";

import { render } from "@testing-library/react";


export const theBag = {
  urls: {
    bag: "/ims/api/bag",
    auth: "/ims/api/auth",
    event: "/ims/api/events/<eventID>/",
    events: "/ims/api/events/",
  },
}


export class TestIncidentManagementSystem extends IncidentManagementSystem {

  static timeout = moment.duration(5, "minutes");

  constructor(bagURL) {
    super(bagURL);

    this._testEvents = ([
      { id: "1", name: "Event One" },
      { id: "2", name: "Event Two" },
      { id: "3", name: "Event Three" },
      { id: "4", name: "Event Four" },
    ])

    this.requestsReceived = [];

    fetch = jest.fn(this._mockFetch);
  }

  _notFoundResponse = () => {
    return new Response(
      "Resource not found",
      {
        status: 404,
        statusText: "Resource Not Found",
        headers: { "Content-Type": "text/plain" }
      },
    )
  }

  _authTextResponse = () => {
    return new Response(
      "Authentication required.",
      {
        status: 401,
        statusText: "Authentication Required",
        headers: { "Content-Type": "text/plain" }
      },
    )
  }

  _authJSONResponse = () => {
    return new Response(
      JSON.stringify({}),
      {
        status: 401,
        statusText: "Authentication Required",
        headers: { "Content-Type": "application/json" }
      },
    )
  }

  _authFailedResponse = () => {
    return new Response(
      JSON.stringify({ status: "invalid-credentials" }),
      {
        status: 401,
        statusText: "Authentication Failed",
        headers: { "Content-Type": "application/json" }
      },
    )
  }

  _forbiddenResponse = () => {
    return new Response(
      "No soup for you!",
      {
        status: 403,
        statusText: "Forbidden",
        headers: { "Content-Type": "text/plain" }
      },
    )
  }

  _jsonResponse = (json) => {
    return new Response(
      JSON.stringify(json),
      {
        status: 200,
        statusText: "Okay, here's some JSON",
        headers: { "Content-Type": "application/json" }
      },
    )
  }

  _textResponse = (json) => {
    return new Response(
      "Hello!",
      {
        status: 200,
        statusText: "Okay, here's some text",
        headers: { "Content-Type": "text/plain" }
      },
    )
  }

  _authResponse = (requestJSON) => {
    const username = requestJSON.identification;
    const password = requestJSON.password;
    const expiration = moment().add(TestIncidentManagementSystem.timeout);

    if (username != password) {
      return this._authFailedResponse();
    }

    const responseJSON = {
      username: username,
    };

    if (username != "No Token") {
      const now = Date.now() / 1000;
      const jwtPayload = {
        // iss: "TestIMS",
        // sub: "PERSON_ID_GOES_HERE",
        exp: now + 60,
        // iat: now,
        preferred_username: username,
      }
      switch (username) {
        case "Hubcap":
          break;
        case "XYZZY":
          jwtPayload.preferred_username = "Cretin";
          break;
        case "Forever":
          delete jwtPayload.exp;
          break;
        default:
          /* istanbul ignore next */
          return this._authFailedResponse();
      }
      responseJSON.token = jwtSign(jwtPayload, "SEKRET");
    }

    return this._jsonResponse(responseJSON);
  }

  _mockFetch = async (request) => {
    this.requestsReceived.push(request);

    let path;
    try {
      const url = new URL(request.url);
      path = url.pathname;
    }
    catch {
      path = request.url;
    }

    switch (path) {
      case theBag.urls.bag:
        /* istanbul ignore else */
        if (request.method === "GET") {
          return this._jsonResponse(theBag);
        }
        /* istanbul ignore next */
        break;
      case theBag.urls.auth:
        /* istanbul ignore else */
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          return await this._authResponse(requestJSON);
        }
        /* istanbul ignore next */
        break;
      case theBag.urls.events:
        /* istanbul ignore else */
        if (request.method === "GET") {
          return this._jsonResponse(this._testEvents);
        }
        /* istanbul ignore next */
        break;
      case "/not_found":
        return await this._notFoundResponse();
      case "/auth_fail_text":
        return await this._authTextResponse();
      case "/auth_fail_json_no_status":
        return await this._authJSONResponse();
      case "/auth_fail_json":
        return await this._authFailedResponse();
      case "/forbidden":
        return await this._forbiddenResponse();
      case "/json_echo":
        /* istanbul ignore else */
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          return await this._jsonResponse(requestJSON);
        }
        /* istanbul ignore next */
        break;
      case "/text_hello":
        return await this._textResponse();
      case "/janky_bag":
        return this._jsonResponse("{}");
    }

    /* istanbul ignore next */
    throw new Error(`Unexpected request: ${request.method} ${path}`);
  }

  // For testing
  asHubcap = async () => {
    const username = "Hubcap";
    const password = username;

    await this.login(username, {password: password});

    return this;
  }
}


export function testIncidentManagementSystem(username) {
  const ims = new TestIncidentManagementSystem("/ims/api/bag");

  if (username !== undefined) {
    ims.user = new User(
      username, { expiration: moment().add(1, "hour") }
    );
  }

  return ims;
}


export const renderWithIMS = (content, ims, ...renderOptions) => {
  return render(
    (
      <IMSContext.Provider value={{ims: ims}}>
        {content}
      </IMSContext.Provider>
    ),
    ...renderOptions
  );
}
