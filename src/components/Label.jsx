import invariant from "invariant";

import Form from "react-bootstrap/Form";

const Label = ({ id, label }) => {
  invariant(id != null, "id property is required");
  invariant(label != null, "label property is required");

  return (
    <Form.Label htmlFor={id} className="my-auto me-1">
      {label}:
    </Form.Label>
  );
};

export default Label;
