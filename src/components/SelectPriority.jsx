import invariant from "invariant";

import IncidentModel from "../ims/model/Incident";

import LabeledSelect from "./LabeledSelect";

const SelectPriority = ({ priority }) => {
  invariant(priority != null, "priority property is required");

  return (
    <LabeledSelect
      id="incident_priority"
      label="Priority"
      values={IncidentModel.nonDeprecatedPriorities(priority)}
      selected={priority}
      valueToString={IncidentModel.priorityToString}
    />
  );
};

export default SelectPriority;
