import jwtSign from "jsonwebtoken/sign";
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

  _authFailedResponse = () => {
    return new Response(
      JSON.stringify({ status: "invalid-credentials" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    )
  }

  _authResponse = (requestJSON) => {
    const username = requestJSON.identification;
    const password = requestJSON.password;
    const expiration = moment().add(TestAuthentationSource.timeout);

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
        prefered_username: username,
      }
      switch (username) {
        case "Hubcap":
          break;
        case "XYZZY":
          jwtPayload.prefered_username = "Cretin";
          break;
        case "Forever":
          delete jwtPayload.exp;
          break;
        default:
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
        if (request.method === "GET") {
          return this._jsonResponse(theBag);
        }
        break;
      case theBag.urls.auth:
        /* istanbul ignore else */
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          return await this._authResponse(requestJSON);
        }
        break;
      case "/echo_json":
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          return await this._jsonResponse(requestJSON);
        }
        break;
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
