import FormGroup from "./FormGroup";
import Label from "./Label";
import LabeledTextField from "./LabeledTextField";
import Well from "./Well";

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
