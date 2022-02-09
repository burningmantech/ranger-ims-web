import invariant from "invariant";

import { useContext } from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { IMSContext } from "../ims/context";
import IncidentModel from "../ims/model/Incident";

const Label = ({ id, label }) => {
  return (
    <Form.Label htmlFor={id} className="my-auto me-1">
      {label}:
    </Form.Label>
  );
};

const FormGroup = ({ as, children }) => {
  return (
    <Form.Group as={as} className="d-flex align-items-center p-2">
      {children}
    </Form.Group>
  );
};

const LabeledSelect = ({ id, label, values, selected, valueToString }) => {
  invariant(id != null, "id property is required");
  invariant(label != null, "label property is required");
  invariant(values != null, "values property is required");
  invariant(selected != null, "selected property is required");
  invariant(valueToString != null, "valueToString property is required");

  return (
    <FormGroup>
      <Label id={id} label={label} />
      <Form.Select id={id} size="sm" className="w-auto" defaultValue={selected}>
        {values.map((value) => (
          <option key={value} value={value}>
            {valueToString(value)}
          </option>
        ))}
      </Form.Select>
    </FormGroup>
  );
};

const LabeledTextField = ({ id, value, placeholder }) => {
  invariant(id != null, "id property is required");
  invariant(placeholder != null, "placeholder property is required");

  // className="d-inline w-auto"
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

const SummaryCard = ({ summary }) => {
  return (
    <Card>
      <Card.Body className="bg-light p-1">
        <FormGroup>
          <Label id="incident_summary" label="Summary" />
          <LabeledTextField
            id="incident_summary"
            value={summary}
            placeholder="Summary"
          />
        </FormGroup>
      </Card.Body>
    </Card>
  );
};

const LocationCard = ({ locationName }) => {
  return (
    <Card>
      <Card.Body className="bg-light p-1">
        <FormGroup as={Container}>
          <Row>
            <Col sm={2}>
              <Label id="incident_location_name" label="Name" />
            </Col>
            <Col sm={10}>
              <LabeledTextField
                id="incident_location_name"
                value={locationName}
                placeholder="Location Name"
              />
            </Col>
          </Row>
        </FormGroup>
      </Card.Body>
    </Card>
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
          <SummaryCard summary={incident.summary} />
        </Col>
      </Row>

      <Row>
        <Col>
          <LocationCard locationName={incident.location.name} />
        </Col>
      </Row>
    </div>
  );
};

export default Incident;
