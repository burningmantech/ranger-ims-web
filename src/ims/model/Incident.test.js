import { DateTime } from "luxon";

import Incident from "./Incident";
import Location from "./Location";

describe("Incident", () => {
  test("stateToName, valid", () => {
    expect(Incident.stateToName("new")).toEqual("New");
    expect(Incident.stateToName("on_hold")).toEqual("On Hold");
    expect(Incident.stateToName("dispatched")).toEqual("Dispatched");
    expect(Incident.stateToName("on_scene")).toEqual("On Scene");
    expect(Incident.stateToName("closed")).toEqual("Closed");
  });

  test("stateToName, invalid", () => {
    for (const value of [-1, "XYZZY"]) {
      expect(() => Incident.stateToName(value)).toThrow(
        `Invalid state: ${value}`,
      );
    }
  });

  test("nonDeprecatedPriorities", () => {
    expect(Incident.nonDeprecatedPriorities()).toEqual([1, 3, 5]);
    expect(Incident.nonDeprecatedPriorities(1)).toEqual([1, 3, 5]);
    expect(Incident.nonDeprecatedPriorities(2)).toEqual([2, 3, 5]);
    expect(Incident.nonDeprecatedPriorities(3)).toEqual([1, 3, 5]);
    expect(Incident.nonDeprecatedPriorities(4)).toEqual([1, 3, 4]);
    expect(Incident.nonDeprecatedPriorities(5)).toEqual([1, 3, 5]);
  });

  test("priorityToName, valid", () => {
    expect(Incident.priorityToName(1)).toEqual("High");
    expect(Incident.priorityToName(2)).toEqual("High");
    expect(Incident.priorityToName(3)).toEqual("Normal");
    expect(Incident.priorityToName(4)).toEqual("Low");
    expect(Incident.priorityToName(5)).toEqual("Low");
  });

  test("priorityToName, invalid", () => {
    for (const value of [-1, "XYZZY"]) {
      expect(() => Incident.priorityToName(value)).toThrow(
        `Invalid priority: ${value}`,
      );
    }
  });

  test("fromJSON, valid", () => {
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
      incident_reports: [1, 5, 8],
      report_entries: [
        {
          system_entry: true,
          created: "2020-08-18T00:12:46.000Z",
          author: "Operator",
          text: "Changed description name to: On B road",
        },
        {
          system_entry: false,
          created: "2021-08-17T17:23:00.000Z",
          author: "Operator",
          text: "White pickup stopped on road, eventually moved",
        },
        {
          system_entry: true,
          created: "2021-08-28T00:37:37.000Z",
          author: "Operator",
          text: "Changed state to: closed",
        },
      ],
    };

    const result = Incident.fromJSON(incidentJSON);
    const resultJSON = result.toJSON();

    expect(resultJSON).toEqual(incidentJSON);
  });

  test("fromJSON, invalid", () => {
    expect(() => Incident.fromJSON({})).toThrow("Invalid incident JSON (");
  });

  test("toString", () => {
    const eventID = "1";
    const number = 4;
    const created = DateTime.fromISO("2021-08-17T17:12:46.72Z");
    const state = "open";
    const priority = 3;
    const location = new Location({});
    const summary = "Snake in someone's boots";
    const rangerHandles = ["Bucket", "Hubcap"];
    const incidentTypes = ["Medical", "Theme Camp"];
    const incidentReportNumbers = [23, 57, 104];
    const reportEntries = [];
    const incident = new Incident({
      eventID,
      number,
      created,
      state,
      priority,
      summary,
      location,
      rangerHandles,
      incidentTypes,
      incidentReportNumbers,
      reportEntries,
    });
    const result = incident.toString();

    expect(result).toEqual(`(${eventID}#${number})`);
  });

  test("toJSON, with location", () => {
    const eventID = "1";
    const number = 4;
    const created = DateTime.fromISO("2021-08-17T17:12:46.72Z").toUTC();
    const state = "open";
    const priority = 3;
    const location = new Location({});
    const summary = "Snake in someone's boots";
    const rangerHandles = ["Bucket", "Hubcap"];
    const incidentTypes = ["Medical", "Theme Camp"];
    const incidentReportNumbers = [23, 57, 104];
    const reportEntries = [];
    const incident = new Incident({
      eventID,
      number,
      created,
      state,
      priority,
      summary,
      location,
      rangerHandles,
      incidentTypes,
      incidentReportNumbers,
      reportEntries,
    });
    const result = incident.toJSON();

    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        event: eventID,
        number,
        created,
        state,
        priority,
        summary,
        location,
        ranger_handles: rangerHandles,
        incident_types: incidentTypes,
        incident_reports: incidentReportNumbers,
        report_entries: reportEntries,
      }),
    );
  });

  test("toJSON, no location", () => {
    const eventID = "1";
    const number = 4;
    const created = DateTime.fromISO("2021-08-17T17:12:46.72Z").toUTC();
    const state = "open";
    const priority = 3;
    const summary = "Snake in someone's boots";
    const rangerHandles = ["Bucket", "Hubcap"];
    const incidentTypes = ["Medical", "Theme Camp"];
    const incidentReportNumbers = [23, 57, 104];
    const reportEntries = [];
    const incident = new Incident({
      eventID,
      number,
      created,
      state,
      priority,
      summary,
      rangerHandles,
      incidentTypes,
      incidentReportNumbers,
      reportEntries,
    });
    const result = incident.toJSON();

    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        event: eventID,
        number,
        created,
        state,
        priority,
        summary,
        location: null,
        ranger_handles: rangerHandles,
        incident_types: incidentTypes,
        incident_reports: incidentReportNumbers,
        report_entries: reportEntries,
      }),
    );
  });

  test("summarize, with summary", () => {
    const eventID = "1";
    const number = 4;
    const created = DateTime.now();
    const state = "open";
    const priority = 3;
    const location = new Location({});
    const summary = "Snake in someone's boots";
    const rangerHandles = [];
    const incidentTypes = [];
    const incidentReportNumbers = [23, 57, 104];
    const reportEntries = [];
    const incident = new Incident({
      eventID,
      number,
      created,
      state,
      priority,
      summary,
      location,
      rangerHandles,
      incidentTypes,
      incidentReportNumbers,
      reportEntries,
    });

    expect(incident.summarize()).toEqual(summary);
  });

  test("summarize, without summary", () => {
    const eventID = "1";
    const number = 4;
    const created = DateTime.now();
    const state = "open";
    const priority = 3;
    const location = new Location({});
    const summary = null;
    const rangerHandles = [];
    const incidentTypes = [];
    const incidentReportNumbers = [23, 57, 104];
    const reportEntries = [];
    const incident = new Incident({
      eventID,
      number,
      created,
      state,
      priority,
      summary,
      location,
      rangerHandles,
      incidentTypes,
      incidentReportNumbers,
      reportEntries,
    });

    expect(incident.summarize()).toEqual("<summary goes here>");
  });
});
