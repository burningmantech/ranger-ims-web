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
  }

  _jsonResponse = (json) => {
    return new Response(
      JSON.stringify(json),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  }

  _notFoundResponse = () => {
    return new Response(
      "Resource not found",
      { status: 404, headers: { "Content-Type": "text/plain" } },
    )
  }

  _fetch = async (request) => {
    console.log("Issuing (fake) request to: " + request.url);

    this.requestsReceived.push(request);

    const url = new URL(request.url);

    switch (url.pathname) {
      case theBag.urls.bag:
        return this._jsonResponse(theBag);
      case theBag.urls.auth:
        return this._jsonResponse("");
      default:
        console.log("Not found: " + url.pathname);
        return this._notFoundResponse();
    }
  }
}


export function testIncidentManagementSystem() {
  return new TestIncidentManagementSystem(
    new URL("https://localhost/ims/api/bag")
  );
}
