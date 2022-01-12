import { DateTime } from "luxon";

import Event from "./Event";
import Incident from "./Incident";


const eventID = "1";
const number = 4;
const created = DateTime.fromISO("2021-08-17T17:12:46.720000+00:00");
const state = "open";
const priority = 3;
// const location =
const summary = "Snake in someone's boots";
const rangerHandles = ["Bucket", "Hubcap"];
const incidentTypes = ["Medical", "Theme Camp"];

const anIncident = new Incident(
  {
    "eventID": eventID,
    "number": number,
    "created": created,
    "state": state,
    "priority": priority,
    "summary": summary,
    // "location": location,
    "rangerHandles": rangerHandles,
    "incidentTypes": incidentTypes,
  }
);


describe("Incident", () => {

  test(
    "toString", () => {
      const result = anIncident.toString();

      expect(result).toEqual(`(${eventID}#${number})`);
    }
  );

  test(
    "toJSON, valid", () => {
      const result = anIncident.toJSON();

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify(
          {
            "event": eventID,
            "number": number,
            "created": created,
            "state": state,
            "priority": priority,
            "summary": summary,
            // "location": location,
            "ranger_handles": rangerHandles,
            "incident_types": incidentTypes,
          }
        )
      );
    }
  );

  test(
    "fromJSON, invalid", () => {
      expect(
        () => Incident.fromJSON("{}")
      ).toThrow(`Invalid Incident JSON: {}`);
    }
  );

});
