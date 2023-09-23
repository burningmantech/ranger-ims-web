import invariant from "invariant";

import Well from "../base/Well";

const NarrativeCard = ({ reportEntries }) => {
  invariant(reportEntries != null, "reportEntries property is required");

  return (
    <Well id="incident_narrative_card" title="Incident Narrative">
      ...narrative card...
    </Well>
  );
};

export default NarrativeCard;
