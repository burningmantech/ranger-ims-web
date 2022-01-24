import { DateTime } from "luxon";

import Event from "./Event";
import Incident from "./Incident";
import Location from "./Location";


describe("Incident", () => {

  test(
    "toString", () => {
      const eventID = "1";
      const number = 4;
      const created = DateTime.fromISO("2021-08-17T17:12:46.72Z");
      const state = "open";
      const priority = 3;
      const location = new Location({});
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
          "location": location,
          "rangerHandles": rangerHandles,
          "incidentTypes": incidentTypes,
        }
      );
      const result = anIncident.toString();

      expect(result).toEqual(`(${eventID}#${number})`);
    }
  );

  test(
    "toJSON, with location", () => {
      const eventID = "1";
      const number = 4;
      const created = DateTime.fromISO(
        "2021-08-17T17:12:46.72Z"
      ).toUTC();
      const state = "open";
      const priority = 3;
      const location = new Location({});
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
          "location": location,
          "rangerHandles": rangerHandles,
          "incidentTypes": incidentTypes,
        }
      );
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
            "location": location,
            "ranger_handles": rangerHandles,
            "incident_types": incidentTypes,
          }
        )
      );
    }
  );

  test(
    "toJSON, no location", () => {
      const eventID = "1";
      const number = 4;
      const created = DateTime.fromISO(
        "2021-08-17T17:12:46.72Z"
      ).toUTC();
      const state = "open";
      const priority = 3;
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
          "rangerHandles": rangerHandles,
          "incidentTypes": incidentTypes,
        }
      );
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
            "location": null,
            "ranger_handles": rangerHandles,
            "incident_types": incidentTypes,
          }
        )
      );
    }
  );

  test(
    "fromJSON, valid", () => {
      const incidentJSON = {
        event: "1",
        number: 1,
        created: "2021-08-17T17:12:46.000Z",
        summary: "Vehicle lockout",
        priority: 5,
        state: "closed",
        incident_types: ["Vehicle", "Camp"],
        ranger_handles: ["Bucket", "Hubcap"],
        location: {
          type: "garett",
          name: "Fanstasmo!",
          description: "On B road",
          radial_hour: 8,
          radial_minute: 45,
          concentric: "B",
        },
        // incident_reports: [],
        // report_entries: [
        //   {
        //     system_entry: true,
        //     created: "2020-08-17T17:12:46.000-07:00",
        //     author: "Operator",
        //     text: "Changed description name to: On B road",
        //   },
        //   {
        //     system_entry:false,
        //     created:"2021-08-17T17:23:00.000-07:00",
        //     author:"Operator",
        //     text: "White pickup stopped on road, eventually moved",
        //   },
        //   {
        //     system_entry:true,
        //     created:"2021-08-28T00:37:37.000-07:00",
        //     author:"Operator",
        //     text:"Changed state to: closed",
        //   },
        // ],
      };

      const result = Incident.fromJSON(incidentJSON);
      const resultJSON = result.toJSON();

      expect(resultJSON).toEqual(incidentJSON);
    }
  );

  test(
    "fromJSON, invalid", () => {
      expect(() => Incident.fromJSON({})).toThrow(`Invalid incident JSON: {}`);
    }
  );

  test(
    "stateToString, valid",
    () => {
      expect(Incident.stateToString("new")).toEqual("New");
      expect(Incident.stateToString("on_hold")).toEqual("On Hold");
      expect(Incident.stateToString("dispatched")).toEqual("Dispatched");
      expect(Incident.stateToString("on_scene")).toEqual("On Scene");
      expect(Incident.stateToString("closed")).toEqual("Closed");
    }
  );

  test(
    "stateToString, invalid",
    () => {
      for (const value of [-1, "XYZZY"]) {
        expect(
          () => Incident.stateToString(value)
        ).toThrow(`Invalid state: ${value}`)
      }
    }
  );

  test(
    "priorityToString, valid",
    () => {
      expect(Incident.priorityToString(1)).toEqual("High");
      expect(Incident.priorityToString(2)).toEqual("High");
      expect(Incident.priorityToString(3)).toEqual("Normal");
      expect(Incident.priorityToString(4)).toEqual("Low");
      expect(Incident.priorityToString(5)).toEqual("Low");
    }
  );

  test(
    "priorityToString, invalid",
    () => {
      for (const value of [-1, "XYZZY"]) {
        expect(
          () => Incident.priorityToString(value)
        ).toThrow(`Invalid priority: ${value}`)
      }
    }
  );

});
