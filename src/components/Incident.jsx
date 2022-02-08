import invariant from "invariant";

import { useContext } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { IMSContext } from "../ims/context";
import IncidentModel from "../ims/model/Incident";

const LabeledSelect = ({ id, label, values, selected, valueToString }) => {
  invariant(id != null, "id property is required");
  invariant(label != null, "label property is required");
  invariant(values != null, "values property is required");
  invariant(selected != null, "selected property is required");
  invariant(valueToString != null, "valueToString property is required");

  return (
    <Form.Group className="d-flex align-items-center p-2">
      <Form.Label htmlFor={id} className="my-auto me-1">
        {label}:
      </Form.Label>
      <Form.Select id={id} size="sm" className="w-auto" defaultValue={selected}>
        {values.map((value) => (
          <option key={value} value={value}>
            {valueToString(value)}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const LabeledTextField = ({ id, label, value, defaultValue }) => {
  invariant(id != null, "id property is required");
  invariant(label != null, "label property is required");
  invariant(defaultValue != null, "defaultValue property is required");

  // className="d-inline w-auto"
  return (
    <Form.Group className="d-flex align-items-center p-2">
      <Form.Label htmlFor={id} className="my-auto me-1">
        {label}:
      </Form.Label>
      <Form.Control
        type="text"
        inputMode="latin-prose"
        id={id}
        size="sm"
        value={value}
        placeholder={defaultValue}
      />
    </Form.Group>
  );
};

const SelectState = ({ state }) => {
  invariant(state != null, "state property is required");

  return (
    <LabeledSelect
      id="incident_state"
      label="State"
      values={IncidentModel.states}
      selected={state}
      valueToString={IncidentModel.stateToString}
    />
  );
};

const SelectPriority = ({ priority }) => {
  invariant(priority != null, "priority property is required");

  return (
    <LabeledSelect
      id="incident_priority"
      label="Priority"
      values={IncidentModel.nonDeprecatedPriorities(priority)}
      selected={priority}
      valueToString={IncidentModel.priorityToString}
    />
  );
};

const SummaryTextField = ({ summary }) => {
  return (
    <LabeledTextField
      id="incident_summary"
      label="Summary"
      value={summary}
      defaultValue="default value"
    />
  );
};

const Incident = ({ incident }) => {
  invariant(incident != null, "incident property is required");

  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  return (
    <div id="incident_wrapper">
      <h1>Incident #{incident.number}</h1>

      <Row>
        <Col className="text-start" />
        <Col className="text-center">
          <SelectState state={incident.state} />
        </Col>
        <Col className="text-end">
          <SelectPriority priority={incident.priority} />
        </Col>
      </Row>

      <Row>
        <Col>
          <SummaryTextField summary={incident.summary} />
        </Col>
      </Row>
    </div>
  );
};

export default Incident;
