import invariant from "invariant";

import Incident from "../ims/model/Incident";

import LabeledSelect from "./LabeledSelect";

const SelectPriority = ({ priority, setPriority }) => {
  invariant(priority != null, "priority property is required");
  invariant(setPriority != null, "setPriority property is required");

  return (
    <LabeledSelect
      id="incident_priority"
      label="Priority"
      value={priority}
      setValue={(s) => setPriority(parseInt(s))}
      values={Incident.nonDeprecatedPriorities(priority).map((p) => [p, p])}
      valueToName={Incident.priorityToName}
    />
  );
};

export default SelectPriority;
