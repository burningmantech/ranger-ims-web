import FormGroup from "../base/FormGroup";
import Label from "../base/Label";
import LabeledTextField from "../base/LabeledTextField";
import Well from "../base/Well";

const SummaryCard = ({ summary }) => {
  return (
    <Well id="incident_summary_card">
      <FormGroup>
        <Label id="incident_summary" label="Summary" />
        <LabeledTextField
          id="incident_summary"
          value={summary}
          placeholder="One-line summary of incident"
        />
      </FormGroup>
    </Well>
  );
};

export default SummaryCard;
