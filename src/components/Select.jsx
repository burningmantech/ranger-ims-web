import invariant from "invariant";

import Form from "react-bootstrap/Form";

const Select = ({ id, width, selected, options }) => {
  invariant(id != null, "id property is required");
  invariant(width != null, "width property is required");
  invariant(options != null, "options property is required");

  const onChange = (event) => {
    console.info(event);
  };

  // FIXME: Can we set width via Bootstrap instead of style?
  return (
    <Form.Select
      id={id}
      size="sm"
      style={{ flex: "initial", width: width }}
      value={selected == null ? "" : selected}
      onChange={onChange}
    >
      <option key={null} value={null} />
      {Array.from(options, ([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </Form.Select>
  );
};

export default Select;
