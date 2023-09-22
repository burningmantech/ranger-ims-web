import invariant from "invariant";

import Form from "react-bootstrap/Form";

const LabeledTextField = ({ id, value, setValue, placeholder }) => {
  invariant(id != null, "id property is required");
  invariant(setValue != null, "setValue property is required");
  invariant(placeholder != null, "placeholder property is required");

  const onChange = async (event) => {
    await setValue(event.target.value);
  };

  return (
    <Form.Control
      type="text"
      inputMode="latin-prose"
      id={id}
      size="sm"
      defaultValue={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default LabeledTextField;
