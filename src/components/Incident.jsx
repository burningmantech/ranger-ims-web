import invariant from "invariant";

import { useContext } from "react";

import Col from "react-bootstrap/Col";
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
    <Form.Group>
      <Form.Label htmlFor={id}>{label}:</Form.Label>
      <Form.Select
        id={id}
        size="sm"
        className="d-inline w-auto"
        defaultValue={selected}
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {valueToString(value)}
          </option>
        ))}
      </Form.Select>
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
    </div>
  );
};

export default Incident;
