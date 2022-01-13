import invariant from "invariant";
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
          // ping: "/ims/api/ping",
          bag: "/ims/api/bag",
          auth: "/ims/api/auth",
          // access: "/ims/api/access",
          // streets:  "/ims/api/streets",
          // personnel: "/ims/api/personnel/",
          // incident_types:  "/ims/api/incident_types/",
          events: "/ims/api/events/",
          event: "/ims/api/events/{event_id}/",
          incidents: "/ims/api/events/{event_id}/incidents/",
          incident: "/ims/api/events/{event_id}/incidents/{incident_number}",
          // incident_reports: "/ims/api/events/{event_id}/incidents_reports/",
          // incident_report: (
          //   "/ims/api/events/{event_id}/incidents_reports" +
          //   "/{incident_report_number}"
          // ),
          // event_source: "/ims/api/eventsource",
        },
      },
      events: [
        { id: "1", name: "Event One" },
        { id: "2", name: "Event Two" },
        { id: "3", name: "Event Three" },
        { id: "4", name: "Event Four" },
        { id: "empty", name: "Empty Event" },
      ],
      incidents: {  // Lists of incidents, indexes by event ID
        "1": [
          {
            event: "1",
            number: 1,
            created: "2021-08-17T17:12:46.720000+00:00",
            summary: null,
            priority: 5,
            state: "closed",
            incident_types: ["Vehicle", "Camp"],
            ranger_handles: ["Bucket", "Hubcap"],
            location: {
              type: "garett",
              name: null,
              description: "On B road",
              radial_hour: 8,
              radial_minute: 45,
              concentric: "B",
            },
            incident_reports: [],
            report_entries: [
              {
                system_entry: true,
                created: "2020-08-17T17:12:46.730000+00:00",
                author: "Operator",
                text: "Changed description name to: On B road",
              },
              {
                system_entry:false,
                created:"2021-08-17T17:23:00.780000+00:00",
                author:"Operator",
                text: "White pickup stopped on road, eventually moved",
              },
              {
                system_entry:true,
                created:"2021-08-28T00:37:37.300000+00:00",
                author:"Operator",
                text:"Changed state to: closed",
              },
            ],
          },
          {
            event: "1",
            number: 2,
            created: "2020-08-17T18:45:46.920000+00:00",
            summary: "Ice cream at the Man",
            priority: 1,
            state: "open",
            incident_types: ["Ice Cream"],
            ranger_handles: [],
            location: {
              type: "text",
              name: "The Man",
              description: null,
            },
            incident_reports: [],
            report_entries: [
              {
                system_entry:false,
                created:"2021-08-17T18:45:46.930000+00:00",
                author:"Operator",
                text: "Someone is giving away ice cream at the Man",
              },
            ],
          },
        ],
        "2": [
          {
            event: "2",
            number: 1,
            created: "2021-02-00T18:45:46.920000+00:00",
            summary: "Cat in tree",
            priority: 1,
            state: "closed",
            incident_types: ["Cat"],
            ranger_handles: [],
            location: {
              type: "text",
              name: "Some tree",
              description: null,
            },
            incident_reports: [],
            report_entries: [],
          },
          {
            event: "2",
            number: 2,
            created: "2021-03-00T18:45:46.920000+00:00",
            summary: "Dog in tree",
            priority: 1,
            state: "closed",
            incident_types: ["Dog"],
            ranger_handles: [],
            location: {
              type: "text",
              name: "That tree again",
              description: null,
            },
            incident_reports: [],
            report_entries: [],
          },        ],
        "3": [],
        "4": [],
        "empty": [],
      },
    };

    // Validate above test data a bit
    const cmp = (a) => JSON.stringify(a.sort());
    const eventIDs = cmp(this.testData.events.map((e) => e.id));
    const incidentEventIDs = cmp(Object.keys(this.testData.incidents));
    invariant(
      eventIDs == incidentEventIDs,
      "Events and incidents index keys mismatched: " +
      `${eventIDs} != ${incidentEventIDs}`
    );
    for (const eventID of Object.keys(this.testData.incidents)) {
      const incidents = this.testData.incidents[eventID];
      for (const incident of incidents) {
        invariant(
          eventID == incident.event,
          `Incident #${incident.number} in event ID ${eventID} has ` +
          `mismatched event ID: ${incident.event}`
        );
      }
      const incidentNumbers = incidents.map((i) => i.number);
      invariant(
        cmp(incidentNumbers) == cmp(Array.from(new Set(incidentNumbers))),
        `Incident numbers in event ID ${eventID} contain duplicates: ` +
        `${incidentNumbers}`
      )
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
    let _path;
    try {
      const url = new URL(request.url);
      _path = url.pathname;
    }
    catch {
      _path = request.url;
    }
    const path = _path;

    const bag = this.testData.bag;

    switch (true) {
      case path == "/not_found":
        console.debug("Issuing not found response.");
        return this._notFoundResponse();

      case path == "/auth_fail_text":
        console.debug("Issuing authentication required text response.");
        return this._authTextResponse();

      case path == "/auth_fail_json_no_status":
        console.debug("Issuing authentication required JSON response.");
        return this._authJSONResponse();

      case path == "/auth_fail_json":
        console.debug("Issuing authentication failed JSON response.");
        return this._authFailedResponse();

      case path == "/forbidden":
        console.debug("Issuing forbidden response.");
        return this._forbiddenResponse();

      case path == "/json_echo":
        /* istanbul ignore else */
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          console.debug("Issuing JSON echo response.");
          return this._jsonResponse(requestJSON);
        }
        /* istanbul ignore next */
        break;

      case path == "/text_hello":
      console.debug("Issuing hello text response.");
        return this._textResponse();

      case path == "/ims/api/bag":
        /* istanbul ignore else */
        if (request.method === "GET") {
          console.debug("Issuing bag response.");
          return this._jsonResponse(bag);
        }
        /* istanbul ignore next */
        break;

      case path == bag.urls.auth:
        /* istanbul ignore else */
        if (request.method === "POST") {
          const requestJSON = await request.json();
          request._json = requestJSON;
          console.debug("Issuing auth response.");
          return this._authResponse(requestJSON);
        }
        /* istanbul ignore next */
        break;

      case path == bag.urls.events:
        /* istanbul ignore else */
        if (request.method === "GET") {
          console.debug("Issuing events response.");
          return this._jsonResponse(this.testData.events);
        }
        /* istanbul ignore next */
        break;

      case path.startsWith(bag.urls.events):
        let rest = path.substring(bag.urls.events.length);
        const eventID = rest.split("/", 1)[0]

        rest = rest.substring(eventID.length + 1);
        const eventChild = rest.split("/", 1)[0]

        switch (eventChild) {
          case "incidents":
            if (rest != "") {
              console.debug(`Issuing event ${eventID} incidents response.`);
              return this._jsonResponse(this.testData.incidents[eventID]);
            }
        }

        /* istanbul ignore next */
        break;
    }

    /* istanbul ignore next */
    throw new Error(`Unexpected request: ${request.method} ${path}`);
  }

  _mockFetch = async (request) => {
    let response = await this.__mockFetch(request);

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

  addMoreIncidents = async (eventID, total) => {
    const incidents = this.testData.incidents[eventID];
    invariant(incidents != null, `no incidents for event: ${eventID}`);

    const numberToAdd = total - incidents.length;

    // Start with largest incident number
    let nextIncidentNumber = 0;
    for (const incident of incidents) {
      if (incident.number > nextIncidentNumber) {
        nextIncidentNumber = incident.number;
      }
    }

    while (incidents.length < total) {
      nextIncidentNumber += 1;

      const nextIncident = {
        event: eventID,
        number: nextIncidentNumber,
        created: "2021-08-18T10:10:46+00:00",
        summary: null,
        priority: 3,
        state: "new",
        incident_types: [],
        ranger_handles: [],
        location: {type: "text", description: ""},
        incident_reports: [],
        report_entries: [],
      };
      nextIncident.number = nextIncidentNumber;

      incidents.push(nextIncident);
    }
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


export const renderWithIMSContext = (content, ims, ...renderOptions) => {
  if (ims == null) {
    ims = testIncidentManagementSystem();
  }

  return render(
    (
      <IMSContext.Provider value={{ims: ims}}>
        {content}
      </IMSContext.Provider>
    ),
    ...renderOptions
  );
}
