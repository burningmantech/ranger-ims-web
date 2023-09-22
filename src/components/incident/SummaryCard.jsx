import invariant from "invariant";

import FormGroup from "../base/FormGroup";
import Label from "../base/Label";
import LabeledTextField from "../base/LabeledTextField";
import Well from "../base/Well";

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
