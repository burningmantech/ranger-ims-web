import invariant from "invariant";

import FormGroup from "../base/FormGroup";
import Label from "../base/Label";
import Select from "../base/Select";

const LabeledSelect = ({ id, label, value, setValue, values, valueToName }) => {
  invariant(id != null, "id property is required");
  invariant(label != null, "label property is required");
  invariant(values != null, "values property is required");
  invariant(setValue != null, "setValue property is required");

  return (
    <FormGroup>
      <Label id={id} label={label} />
      <Select
        id={id}
        size="sm"
        width="auto"
        value={value}
        setValue={setValue}
        values={values}
        valueToName={valueToName}
      />
    </FormGroup>
  );
};

export default LabeledSelect;
