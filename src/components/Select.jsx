import invariant from "invariant";

import Form from "react-bootstrap/Form";

const controlClearStatus = (control) => {
  control.classList.remove("bg-warning");
  control.classList.remove("bg-success");
  control.classList.remove("bg-danger");
};

const controlIsBusy = (control) => {
  console.debug("Control is busy", control);
  controlClearStatus(control);
  control.classList.add("bg-warning");
};

const controlHadSuccess = (control) => {
  console.debug("Control had success", control);
  controlClearStatus(control);
  control.classList.add("bg-success");

  setTimeout(() => controlClearStatus(control), 1000);
};

const controlHadError = (control, timeout) => {
  console.debug("Control had error", control);
  control.classList.add("bg-danger");
  setTimeout(() => controlClearStatus(control), 1000);
};

const controlDidChange = async (event, callback) => {
  console.debug("Control did change", event);
  const control = event.target;

  controlIsBusy(control);
  let updateControl = controlHadSuccess;
  try {
    await callback(control.value);
  } catch (e) {
    console.error(e);
    updateControl = controlHadError;
  }
  updateControl(control);
};

const Select = ({ id, width, value, setValue, values, valueToName }) => {
  invariant(id != null, "id property is required");
  invariant(width != null, "width property is required");
  invariant(value != null, "setValue property is required");
  invariant(setValue != null, "setValue property is required");
  invariant(values != null, "values property is required");

  if (valueToName == null) {
    valueToName = (value) => value;
  }

  const onChange = async (event) => {
    const control = event.target;
    await controlDidChange(event, setValue);
  };

  // FIXME: Can we set width via Bootstrap instead of style?
  return (
    <Form.Select
      id={id}
      size="sm"
      style={{ flex: "initial", width: width }}
      value={value}
      onChange={onChange}
    >
      {value == null ? (
        <option key={null} value={null}>
          {valueToName(value)}
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
