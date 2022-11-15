import invariant from "invariant";

import Incident from "../ims/model/Incident";

import LabeledSelect from "./LabeledSelect";

const SelectState = ({ state, setState }) => {
  invariant(state != null, "state property is required");
  invariant(setState != null, "setState property is required");

  return (
    <LabeledSelect
      id="incident_state"
      label="State"
      value={state}
      setValue={setState}
      values={Incident.states.map((s) => [s, s])}
      valueToName={Incident.stateToName}
    />
  );
};

export default SelectState;
