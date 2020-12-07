import moment from "moment";

import { TestAuthentationSource } from "../auth";
import IncidentManagementSystem from "./IMS";


export const theBag = {
  urls: {
    bag: "/ims/api/bag",
    auth: "/ims/api/auth",
    event: "/ims/api/events/<eventID>/",
    events: "/ims/api/events/",
  },
}


export class TestIncidentManagementSystem extends IncidentManagementSystem {

  constructor(bagURL) {
    super(bagURL);

    this.requestsReceived = [];
    this._authenticationSource = new TestAuthentationSource();

    fetch = jest.fn(this._mockFetch);
  }

  _notFoundResponse = () => {
    return new Response(
      "Resource not found",
      { status: 404, headers: { "Content-Type": "text/plain" } },
    )
  }

  _jsonResponse = (json) => {
    return new Response(
      JSON.stringify(json),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  }

  _authResponse = (requestJSON) => {
    const username = requestJSON.identification;
    const password = requestJSON.password;
    const expiration = moment().add(TestAuthentationSource.timeout);

    let responseUsername;
    if (username === "XYZZY") {
      responseUsername = "Cretin";
    }
    else {
      responseUsername = username;
    }

    const responseJSON = {
      person_id: "PERSON_ID_GOES_HERE",
      username: responseUsername,
    };

    if (username !== "Token") {
      responseJSON.token = "JWT_TOKEN_GOES_HERE";
    }

    if (username === "Friend of Larry") {
      responseJSON.expires_in = "Whenever you like, dude.";
    }
    else if (username !== "Forever") {
      responseJSON.expires_in = expiration.toISOString();
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
        if (request.method === "GET") {
          return this._jsonResponse(theBag);
        }
      case theBag.urls.auth:
        /* istanbul ignore else */
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          return await this._authResponse(requestJSON);
        }
      case "/none":
        return await this._notFoundResponse();
      case "/janky_bag":
        return this._jsonResponse("{}");
    }

    /* istanbul ignore next */
    throw new Error(`Unexpected request: ${request.method} ${path}`);
  }
}


export function testIncidentManagementSystem(bagURL="/ims/api/bag") {
  return new TestIncidentManagementSystem(bagURL);
}
