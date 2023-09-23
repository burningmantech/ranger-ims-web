import invariant from "invariant";

import Well from "../base/Well";

const AttachedIncidentReportsCard = ({ incidentReportNumbers }) => {
  invariant(
    incidentReportNumbers != null,
    "incidentReportNumbers property is required",
  );

  return (
    <Well id="incident_reports_card" title="Attached Incident Reports">
      ...incident reports card...
    </Well>
  );
};

export default AttachedIncidentReportsCard;
