import invariant from "invariant";

import Incident from "../ims/model/Incident";

import LabeledSelect from "./LabeledSelect";

const SelectState = ({ state }) => {
  invariant(state != null, "state property is required");

  return (
    <LabeledSelect
      id="incident_state"
      label="State"
      values={Incident.states}
      selected={state}
      valueToString={Incident.stateToString}
    />
  );
};

export default SelectState;
