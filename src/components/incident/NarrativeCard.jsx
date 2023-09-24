import invariant from "invariant";

import ListGroup from "react-bootstrap/ListGroup";

import Well from "../base/Well";
import ReportEntry from "./ReportEntry";

const NarrativeCard = ({ reportEntries }) => {
  invariant(reportEntries != null, "reportEntries property is required");

  return (
    <Well id="incident_narrative_card" title="Incident Narrative">
      <ListGroup>
        {reportEntries.map((reportEntry) => [
          <ReportEntry reportEntry={reportEntry} />,
        ])}
      </ListGroup>
    </Well>
  );
};

export default NarrativeCard;
