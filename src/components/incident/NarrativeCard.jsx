import invariant from "invariant";

import ListGroup from "react-bootstrap/ListGroup";

import Well from "../base/Well";
import ReportEntry from "./ReportEntry";

const NarrativeCard = ({ reportEntries }) => {
  invariant(reportEntries != null, "reportEntries property is required");

  return (
    <Well id="incident_narrative_card" title="Incident Narrative">
      {reportEntries.map((reportEntry, index) => [
        <ReportEntry reportEntry={reportEntry} />,
      ])}
    </Well>
  );
};

export default NarrativeCard;
