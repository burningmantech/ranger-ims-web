import invariant from "invariant";

import IncidentModel from "../ims/model/Incident";

import LabeledSelect from "./LabeledSelect";

const SelectState = ({ state }) => {
  invariant(state != null, "state property is required");

  return (
    <LabeledSelect
      id="incident_state"
      label="State"
      values={IncidentModel.states}
      selected={state}
      valueToString={IncidentModel.stateToString}
    />
  );
};

export default SelectState;
