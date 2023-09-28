import invariant from "invariant";

import { useState } from "react";

import Form from "react-bootstrap/Form";

import Well from "../base/Well";
import ReportEntry from "./ReportEntry";

const NarrativeCard = ({ reportEntries }) => {
  invariant(reportEntries != null, "reportEntries property is required");

  const [showSystem, setShowSystem] = useState(false);

  const onShowSystemEntriesChange = (event) => {
    setShowSystem(!showSystem);
  };

  return (
    <>
      <Well id="incident_narrative_card" title="Incident Narrative">
        <Form className="d-flex flex-row-reverse">
          <Form.Check
            type="switch"
            id="narrative-show-system-entries"
            label="Show System Entries"
            reverse
            value={showSystem}
            onChange={onShowSystemEntriesChange}
          />
        </Form>
        {reportEntries
          .filter((reportEntry) => showSystem || !reportEntry.systemEntry)
          .map((reportEntry, index) => [
            <ReportEntry key={index} reportEntry={reportEntry} />,
          ])}
      </Well>
    </>
  );
};

export default NarrativeCard;
