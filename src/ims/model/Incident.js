import invariant from "invariant";


export default class Incident {

  static fromJSON = (json) => {
    return new Incident(
      json.event,
      json.number,
    );
  }

  constructor(eventID, number) {
    invariant(eventID != null, "eventID is required");
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

    this.eventID = eventID;
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
    return `#${this.number} (${this.eventID})`;
  }

  toJSON = () => {
    return {
      event: this.eventID,
      number: this.number,
    };
  }

}
