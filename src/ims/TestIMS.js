import jwtSign from "jsonwebtoken/sign";
import { DateTime, Duration } from "luxon";

import User from "./User";
import IncidentManagementSystem from "./IMS";
import { IMSContext } from "./context";

import { render } from "@testing-library/react";


/* https://stackoverflow.com/a/7616484 */
const hashText = (text) => {
  var hash = 0, i, chr;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}


export class TestIncidentManagementSystem extends IncidentManagementSystem {

  static timeout = Duration.fromObject({ minutes: 5 });

  constructor(bagURL) {
    super(bagURL);

    this.testData = {
      bag: {
        urls: {
          bag: "/ims/api/bag",
          auth: "/ims/api/auth",
          event: "/ims/api/events/<eventID>/",
          events: "/ims/api/events/",
        },
      },
      events: [
        { id: "1", name: "Event One" },
        { id: "2", name: "Event Two" },
        { id: "3", name: "Event Three" },
        { id: "4", name: "Event Four" },
      ],
    }

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
    const body = JSON.stringify(json);
    return new Response(
      body,
      {
        status: 200,
        statusText: "Okay, here's some JSON",
        headers: {
          "Content-Type": "application/json",
          "ETag": '"' + hashText(body) + '"',
        }
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
    const expiration = DateTime.local().plus(
      TestIncidentManagementSystem.timeout
    );

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
        /* istanbul ignore next */
        default:
          return this._authFailedResponse();
      }
      responseJSON.token = jwtSign(jwtPayload, "SEKRET");
    }

    return this._jsonResponse(responseJSON);
  }

  __mockFetch = async (request) => {
    let path;
    try {
      const url = new URL(request.url);
      path = url.pathname;
    }
    catch {
      path = request.url;
    }

    const bag = this.testData.bag;

    switch (path) {
      case "/not_found":
        return this._notFoundResponse();

      case "/auth_fail_text":
        return this._authTextResponse();

      case "/auth_fail_json_no_status":
        return this._authJSONResponse();

      case "/auth_fail_json":
        return this._authFailedResponse();

      case "/forbidden":
        return this._forbiddenResponse();

      case "/json_echo":
        /* istanbul ignore else */
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          return this._jsonResponse(requestJSON);
        }
        /* istanbul ignore next */
        break;

      case "/text_hello":
        return this._textResponse();

      case "/janky_bag":
        return this._jsonResponse({});

      case "/ims/api/bag":
        /* istanbul ignore else */
        if (request.method === "GET") {
          return this._jsonResponse(bag);
        }
        /* istanbul ignore next */
        break;

      case bag.urls.auth:
        /* istanbul ignore else */
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          return this._authResponse(requestJSON);
        }
        /* istanbul ignore next */
        break;

      case bag.urls.events:
        /* istanbul ignore else */
        if (request.method === "GET") {
          return this._jsonResponse(this.testData.events);
        }
        /* istanbul ignore next */
        break;
    }

    /* istanbul ignore next */
    throw new Error(`Unexpected request: ${request.method} ${path}`);
  }

  _mockFetch = async (request) => {
    let response;
    try {
      response = await this.__mockFetch(request);
    } catch (e) {
      this.requestsReceived.push([request, e]);
      throw e;
    }

    if (request.method === "GET") {
      const ifNoneMatch = request.headers.get("If-None-Match");
      const responseETag = response.headers.get("ETag");
      if (ifNoneMatch !== null && responseETag !== null) {
        for (const matchETag of ifNoneMatch.split(/, */)) {  // Can be > 1 ETag
          if (matchETag == responseETag) {
            console.debug("Matching ETag found; responding with NOT_MODIFIED");
            response = new Response(
              `Matched ETag: ${responseETag}`,
              {
                status: 304,
                statusText: "Not modified.",
                headers: { "Content-Type": "text/plain" },
              }
            );
          }
        }
      }
    }

    this.requestsReceived.push([request, response]);

    return response;
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
      username, { expiration: DateTime.local().plus({ hours: 1 }) }
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
