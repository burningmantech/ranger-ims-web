import invariant from "invariant";

import Form from "react-bootstrap/Form";

const Select = ({ id, width, values, defaultValue, valueToName, onChange }) => {
  invariant(id != null, "id property is required");
  invariant(width != null, "width property is required");
  invariant(values != null, "values property is required");
  // invariant(defaultValue != null, "defaultValue property is required");

  // console.error(valueToName);

  if (valueToName == null) {
    valueToName = (value) => value;
  }

  if (onChange == null) {
    onChange = (event) => {
      console.warn("Unhandled onChange event");
    };
  }

  // FIXME: Can we set width via Bootstrap instead of style?
  return (
    <Form.Select
      id={id}
      size="sm"
      style={{ flex: "initial", width: width }}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {defaultValue == null ? (
        <option key={null} value={null}>
          {valueToName(defaultValue)}
        </option>
      ) : (
        ""
      )}
      {Array.from(values, ([key, value]) => (
        <option key={key} value={key}>
          {valueToName(value)}
        </option>
      ))}
    </Form.Select>
  );
};

export default Select;
