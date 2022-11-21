import invariant from "invariant";

import FormGroup from "./FormGroup";
import Label from "./Label";
import LabeledTextField from "./LabeledTextField";
import Well from "./Well";

const SummaryCard = ({ summary, setSummary }) => {
  invariant(setSummary != null, "setSummary property is required");

  return (
    <Well id="incident_summary_card">
      <FormGroup>
        <Label id="incident_summary" label="Summary" />
        <LabeledTextField
          id="incident_summary"
          value={summary}
          setValue={setSummary}
          placeholder="One-line summary of incident"
        />
      </FormGroup>
    </Well>
  );
};

export default SummaryCard;
