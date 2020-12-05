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

    return this._jsonResponse({
      token: "JWT_TOKEN_GOES_HERE",
      person_id: "PERSON_ID_GOES_HERE",
      username: username,
      expires_in: expiration.toISOString(),
    });
  }

  _fetch = async (request) => {
    console.log(`Issuing request: ${request.method} ${request.url}`);

    this.requestsReceived.push(request);

    const url = new URL(request.url);

    switch (url.pathname) {
      case theBag.urls.bag:
        if (request.method === "GET") {
          return this._jsonResponse(theBag);
        }
      case theBag.urls.auth:
        if (request.method === "POST") {
          return await this._authResponse(await request.json());
        }
    }

    throw new Error(`Unexpected request: ${request.method} ${url.pathname}`);
  }
}


export function testIncidentManagementSystem() {
  return new TestIncidentManagementSystem(
    new URL("https://localhost/ims/api/bag")
  );
}
