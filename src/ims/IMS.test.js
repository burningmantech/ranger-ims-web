import moment from "moment";

import IncidentManagementSystem from "./IMS";


const theBag = {
  urls: {
    acl: "/ims/api/access",
    bag: "/ims/api/bag",
    event: "/ims/api/events//",
    events: "/ims/api/events/",
    eventSource: "/ims/api/eventsource",
    incidentNumber: "/ims/api/events//incidents/",
    incidentReport: "/ims/api/events//incident_reports/",
    incidentReports: "/ims/api/events//incident_reports/",
    incidents: "/ims/api/events//incidents/",
    incidentTypes: "/ims/api/incident_types/",
    personnel: "/ims/api/personnel/",
    ping: "/ims/api/ping/",
    streets: "/ims/api/streets",
  },
}


class TestIncidentManagementSystem extends IncidentManagementSystem {

  _fetch = async (request) => {
    const url = new URL(request.url);

    switch (url.pathname) {
      case theBag.urls.bag:
        return new Response(JSON.stringify(theBag));
      default:
        throw new Error(`Unexpected request: ${request.method} ${request.url}`);
    }
  }
}


function testIncidentManagementSystem() {
  return new TestIncidentManagementSystem("https://localhost/ims/api/bag");
}


describe("IMS", () => {

  test("bagURL", () => {
    const url = "https://localhost/ims/api/bag";
    const ims = new IncidentManagementSystem(url);

    expect(ims.bagURL).toEqual(url);
  });

  test("bagURL may not be undefined", () => {
    const message = "bagURL is required";

    expect(() => {new IncidentManagementSystem()}).toThrow(message);
  });

  test("bagURL may not be null", () => {
    const message = "bagURL is required";

    expect(() => {new IncidentManagementSystem(null)}).toThrow(message);
  });

  test("bagURL may not be empty string", () => {
    const message = "bagURL is required";

    expect(() => {new IncidentManagementSystem("")}).toThrow(message);
  });

  test("initial state", () => {
    const url = "https://localhost/ims/api/bag";
    const ims = new IncidentManagementSystem(url);

    expect(ims._bag).toBeNull();
  });

  test("load bag, check urls", async () => {
    const now = moment();
    const ims = testIncidentManagementSystem();

    const bag = await ims.bag();

    expect(bag).not.toBeUndefined();
    expect(bag.urls).not.toBeUndefined();

    for (const name in theBag.urls) {
      console.log(name);
      expect(bag.urls[name]).toEqual(theBag.urls[name]);
    }
  });

  test("load bag twice -> same bag", async () => {
    const ims = testIncidentManagementSystem();

    const bag1 = await ims.bag();
    const bag2 = await ims.bag();

    expect(bag2).toBe(bag1);
  });

});
