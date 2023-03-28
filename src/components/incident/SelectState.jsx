import invariant from "invariant";

import Incident from "../../ims/model/Incident";

import LabeledSelect from "../base/LabeledSelect";

const SelectState = ({ state, onChange }) => {
  invariant(state != null, "state property is required");

  return (
    <LabeledSelect
      id="incident_state"
      label="State"
      values={Incident.states.map((s) => [s, s])}
      defaultValue={state}
      valueToName={Incident.stateToName}
      onChange={onChange}
    />
  );
};

export default SelectState;
