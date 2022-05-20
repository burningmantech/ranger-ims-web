import invariant from "invariant";

import Form from "react-bootstrap/Form";

import FormGroup from "./FormGroup";
import Label from "./Label";

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

  if (valueToName == null) {
    valueToName = (value) => value;
  }

  return (
    <FormGroup>
      <Label id={id} label={label} />
      <Form.Select
        id={id}
        size="sm"
        className="w-auto"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {valueToName(value)}
          </option>
        ))}
      </Form.Select>
    </FormGroup>
  );
};

export default LabeledSelect;
