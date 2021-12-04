import invariant from "invariant";

import Event from "./Event";


export default class Incident {

  static fromJSON = (json) => {
    return new Incident(
      Event.fromJSON(json.event),
      json.number,
    );
  }

  constructor(event, number) {
    invariant(event != null, "event is required");
    invariant(number != null, "number is required");
    // invariant(created != null, "created is required");
    // invariant(state != null, "state is required");
    // invariant(priority != null, "priority is required");
    // invariant(summary != null, "summary is required");  // Optional on server
    // invariant(location != null, "location is required");
    // invariant(rangerHandles != null, "rangerHandles is required");
    // invariant(incidentTypes != null, "incidentTypes is required");
    // invariant(reportEntries != null, "reportEntries is required");
    // invariant(
    //   incidentReportNumbers != null, "incidentReportNumbers is required"
    // );

    this.event = event;
    this.number = number;
    // this.created = created;
    // this.state = state;
    // this.priority = priority;
    // this.summary = summary;
    // this.location = location;
    // this.rangerHandles = rangerHandles;
    // this.incidentTypes = incidentTypes;
    // this.reportEntries = reportEntries;
    // this.incidentReportNumbers = incidentReportNumbers;
  }

  toString = () => {
    return `#${this.number} (${this.event})`;
  }

  toJSON = () => {
    return {
      event: this.event.toJSON(),
      number: this.number,
    };
  }

}
