import invariant from "invariant";

import FormGroup from "./FormGroup";
import Label from "./Label";
import Select from "./Select";

const LabeledSelect = ({
  id,
  label,
  values,
  defaultValue,
  valueToName,
  onChange,
}) => {
  invariant(id != null, "id property is required");
  invariant(label != null, "label property is required");
  invariant(values != null, "values property is required");
  invariant(defaultValue != null, "defaultValue property is required");

  return (
    <FormGroup>
      <Label id={id} label={label} />
      <Select
        id={id}
        size="sm"
        width="auto"
        values={values}
        defaultValue={defaultValue}
        valueToName={valueToName}
        onChange={onChange}
      />
    </FormGroup>
  );
};

export default LabeledSelect;
