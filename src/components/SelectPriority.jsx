import invariant from "invariant";

import Incident from "../ims/model/Incident";

import LabeledSelect from "./LabeledSelect";

const SelectPriority = ({ priority }) => {
  invariant(priority != null, "priority property is required");

  return (
    <LabeledSelect
      id="incident_priority"
      label="Priority"
      values={Incident.nonDeprecatedPriorities(priority)}
      defaultValue={priority}
      valueToName={Incident.priorityToString}
    />
  );
};

export default SelectPriority;
