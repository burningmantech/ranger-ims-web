import invariant from "invariant";
import { DateTime } from "luxon";

import Location from "./Location";
import ReportEntry from "./ReportEntry";

export default class Incident {
  static states = Object.freeze([
    "new",
    "open",
    "dispatched",
    "on_scene",
    "on_hold",
    "closed",
  ]);

  static stateToName = (state) => {
    invariant(state != null, "state is required");
    switch (state) {
      case "new":
        return "New";
      case "open":
        return "Open";
      case "dispatched":
        return "Dispatched";
      case "on_scene":
        return "On Scene";
      case "on_hold":
        return "On Hold";
      case "closed":
        return "Closed";
      default:
        throw new Error(`Invalid state: ${state}`);
    }
  };

  static priorities = Object.freeze([1, 2, 3, 4, 5]);

  static nonDeprecatedPriorities = (priority) => {
    // Remove deprecated values (2 and 4)
    // However, if the passed-in priority is itself a deprecated value, remove the
    // other corresponding value (2->1, 4->5) instead, so that we preserve the
    // existing value.
    let priorities = Incident.priorities;
    for (const [deprecated, replacement] of [
      [2, 1],
      [4, 5],
    ]) {
      const remove = priority === deprecated ? replacement : deprecated;
      priorities = priorities.filter((p) => p !== remove);
    }
    return priorities;
  };

  static priorityToName = (priority) => {
    switch (priority) {
      case 1:
      case 2:
        return "High";
      case 3:
        return "Normal";
      case 4:
      case 5:
        return "Low";
      default:
        throw new Error(`Invalid priority: ${priority}`);
    }
  };

  static fromJSON = (json) => {
    const location =
      json.location == null ? null : Location.fromJSON(json.location);
    try {
      return new Incident({
        eventID: json.event,
        number: json.number,
        created: DateTime.fromISO(json.created),
        state: json.state,
        priority: json.priority,
        summary: json.summary,
        location: location,
        rangerHandles: json.ranger_handles,
        incidentTypes: json.incident_types,
        reportEntries: Array.from(json.report_entries, (json) =>
          ReportEntry.fromJSON(json),
        ),
        incidentReportNumbers: json.incident_reports,
      });
    } catch (e) {
      throw new Error(`Invalid incident JSON (${e}): ${JSON.stringify(json)}`);
    }
  };

  constructor({
    eventID, // text
    number, //  int
    created, // DateTime
    state, // "new", "on_hold", "dispatched", "on_scene", "closed"
    priority, // 1, 3, 5; deprecated: 2, 4
    summary, // text
    location, // Location
    rangerHandles, // [text]
    incidentTypes, // [text]
    reportEntries, // [ReportEntry]
    incidentReportNumbers, // [int]
  }) {
    invariant(eventID != null, "eventID is required");
    invariant(number != null, "number is required");
    invariant(created != null, "created is required");
    invariant(state != null, "state is required");
    invariant(priority != null, "priority is required");
    invariant(rangerHandles != null, "rangerHandles is required");
    invariant(incidentTypes != null, "incidentTypes is required");
    invariant(reportEntries != null, "reportEntries is required");
    invariant(
      incidentReportNumbers != null,
      "incidentReportNumbers is required",
    );

    this.eventID = eventID;
    this.number = number;
    this.created = created.toUTC();
    this.state = state;
    this.priority = priority;
    this.summary = summary;
    this.location = location;
    this.rangerHandles = rangerHandles;
    this.incidentTypes = incidentTypes;
    this.reportEntries = reportEntries;
    this.incidentReportNumbers = incidentReportNumbers;
  }

  toString = () => {
    return `(${this.eventID}#${this.number})`;
  };

  toJSON = () => {
    const locationJSON = this.location == null ? null : this.location.toJSON();
    return {
      event: this.eventID,
      number: this.number,
      created: this.created.toISO(),
      state: this.state,
      priority: this.priority,
      summary: this.summary,
      location: locationJSON,
      ranger_handles: this.rangerHandles,
      incident_types: this.incidentTypes,
      incident_reports: this.incidentReportNumbers,
      report_entries: Array.from(this.reportEntries, (reportEntry) =>
        reportEntry.toJSON(),
      ),
    };
  };

  summarize = () => {
    if (this.summary) {
      return this.summary;
    }

    return "<summary goes here>";
  };
}
