import invariant from "invariant";

import Incident from "../ims/model/Incident";

import LabeledSelect from "./LabeledSelect";

const SelectState = ({ state, onChange }) => {
  invariant(state != null, "state property is required");

  return (
    <LabeledSelect
      id="incident_state"
      label="State"
      values={Incident.states}
      defaultValue={state}
      valueToName={Incident.stateToString}
      onChange={onChange}
    />
  );
};

export default SelectState;
