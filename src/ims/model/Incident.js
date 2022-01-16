import invariant from "invariant";
import { DateTime } from "luxon";


export default class Incident {

  static fromJSON = (json) => {
    try {
      return new Incident(
        {
          "eventID": json.event,
          "number": json.number,
          "created": DateTime.fromISO(json.created),
          "state": json.state,
          "priority": json.priority,
          "summary": json.summary,
          // "location": json.location,
          "rangerHandles": json.ranger_handles,
          "incidentTypes": json.incident_types,
          // "reportEntries": json.report_entries,
          // "incidentReportNumbers": json.incident_reports,
        }
      );
    }
    catch (e) {
      throw new Error(`Invalid incident JSON: ${json}`)
    }
  }

  constructor({
    eventID,
    number,
    created,
    state,
    priority,
    summary,
    location,
    rangerHandles,
    incidentTypes,
    reportEntries,
    incidentReportNumbers,
  }) {
    invariant(eventID != null, "eventID is required");
    invariant(number != null, "number is required");
    invariant(created != null, "created is required");
    invariant(state != null, "state is required");
    invariant(priority != null, "priority is required");
    // invariant(location != null, "location is required");
    invariant(rangerHandles != null, "rangerHandles is required");
    invariant(incidentTypes != null, "incidentTypes is required");
    // invariant(reportEntries != null, "reportEntries is required");
    // invariant(
    //   incidentReportNumbers != null, "incidentReportNumbers is required"
    // );

    this.eventID = eventID;
    this.number = number;
    this.created = created;
    this.state = state;
    this.priority = priority;
    this.summary = summary;
    // this.location = location;
    this.rangerHandles = rangerHandles;
    this.incidentTypes = incidentTypes;
    // this.reportEntries = reportEntries;
    // this.incidentReportNumbers = incidentReportNumbers;
  }

  toString = () => {
    return `(${this.eventID}#${this.number})`;
  }

  toJSON = () => {
    return {
      "event": this.eventID,
      "number": this.number,
      "created": this.created.toISO(),
      "state": this.state,
      "priority": this.priority,
      "summary": this.summary,
      // "location": this.location,
      "ranger_handles": this.rangerHandles,
      "incident_types": this.incidentTypes,
      // "report_entries": this.reportEntries,
      // "incident_reports": this.incidentReportNumbers,
    };
  }

  summarize = () => {
    if (this.summary) {
      return this.summary;
    }

    return "<summary goes here>";
  }

}
