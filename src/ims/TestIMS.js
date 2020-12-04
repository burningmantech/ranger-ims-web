import IncidentManagementSystem from "./IMS";


export const theBag = {
  urls: {
    bag: "/ims/api/bag",
    event: "/ims/api/events/<eventID>/",
    events: "/ims/api/events/",
  },
}


export class TestIncidentManagementSystem extends IncidentManagementSystem {

  constructor(bagURL) {
    super(bagURL);
    this.requestsReceived = [];
  }

  _fetch = async (request) => {
    this.requestsReceived.push(request);

    const url = new URL(request.url);

    switch (url.pathname) {
      case theBag.urls.bag:
        return new Response(JSON.stringify(theBag));
      default:
        throw new Error(`Unexpected request: ${request.method} ${request.url}`);
    }
  }
}


export function testIncidentManagementSystem() {
  return new TestIncidentManagementSystem("https://localhost/ims/api/bag");
}
