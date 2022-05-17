import invariant from "invariant";

import Form from "react-bootstrap/Form";

import FormGroup from "./FormGroup";
import Label from "./Label";

const LabeledSelect = ({ id, label, values, selected, valueToString }) => {
  invariant(id != null, "id property is required");
  invariant(label != null, "label property is required");
  invariant(values != null, "values property is required");
  invariant(selected != null, "selected property is required");
  invariant(valueToString != null, "valueToString property is required");

  const onChange = (event) => {
    console.info(event);
  };

  return (
    <FormGroup>
      <Label id={id} label={label} />
      <Form.Select
        id={id}
        size="sm"
        className="w-auto"
        defaultValue={selected}
        onChange={onChange}
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {valueToString(value)}
          </option>
        ))}
      </Form.Select>
    </FormGroup>
  );
};

export default LabeledSelect;
