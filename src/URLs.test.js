import { URLs } from "./URLs";

describe("URLs", () => {
  test("event", () => {
    const eventID = "TTITD";

    expect(URLs.event(eventID)).toEqual(`${URLs.events}${eventID}/`);
  });

  test("incidents", () => {
    const eventID = "TTITD";

    expect(URLs.incidents(eventID)).toEqual(
      `${URLs.events}${eventID}/incidents/`
    );
  });

  test("incident", () => {
    const eventID = "TTITD";
    const incidentNumber = 765;

    expect(URLs.incident(eventID, incidentNumber)).toEqual(
      `${URLs.events}${eventID}/incidents/${incidentNumber}`
    );
  });
});
