import invariant from "invariant";

import ItemListCard from "../base/ItemListCard";

const AttachedIncidentReportsCard = ({ incidentReportNumbers }) => {
  invariant(
    incidentReportNumbers != null,
    "incidentReportNumbers property is required",
  );

  return (
    <ItemListCard
      id="incident_reports_card"
      title="Attached Field Incident Reports"
      items={incidentReportNumbers}
    />
  );
};

export default AttachedIncidentReportsCard;
