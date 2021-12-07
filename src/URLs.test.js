import { URLs } from "./URLs";

import Event from "./ims/model/Event";


describe("URLs", () => {

  test(
    "event", () => {
      const event = new Event("TOT", "That One Time...");

      expect(URLs.event(event)).toEqual(`${URLs.events}${event.id}/`);
    }
  );

  test(
    "incidents", () => {
      const event = new Event("TOT", "That One Time...");

      expect(URLs.incidents(event)).toEqual(
        `${URLs.events}${event.id}/incidents/`
      );
    }
  );

  test(
    "incident", () => {
      const event = new Event("TOT", "That One Time...");
      const incidentNumber = 765;

      expect(URLs.incident(event, incidentNumber)).toEqual(
        `${URLs.events}${event.id}/incidents/${incidentNumber}`
      );
    }
  );

});
