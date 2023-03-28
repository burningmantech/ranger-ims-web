import Form from "react-bootstrap/Form";

const FormGroup = ({ as, children }) => {
  return (
    <Form.Group as={as} className="d-flex align-items-center p-2">
      {children}
    </Form.Group>
  );
};

export default FormGroup;
