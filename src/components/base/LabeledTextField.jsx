import invariant from "invariant";

import Form from "react-bootstrap/Form";

const LabeledTextField = ({ id, value, placeholder }) => {
  invariant(id != null, "id property is required");
  invariant(placeholder != null, "placeholder property is required");

  return (
    <Form.Control
      type="text"
      inputMode="latin-prose"
      id={id}
      size="sm"
      defaultValue={value}
      placeholder={placeholder}
    />
  );
};

export default LabeledTextField;
