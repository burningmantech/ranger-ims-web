import invariant from "invariant";

import Incident from "../../ims/model/Incident";

import LabeledSelect from "../base/LabeledSelect";

const SelectPriority = ({ priority, onChange }) => {
  invariant(priority != null, "priority property is required");

  return (
    <LabeledSelect
      id="incident_priority"
      label="Priority"
      values={Incident.nonDeprecatedPriorities(priority).map((p) => [p, p])}
      defaultValue={priority}
      valueToName={Incident.priorityToName}
      onChange={onChange}
    />
  );
};

export default SelectPriority;
