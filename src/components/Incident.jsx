import invariant from "invariant";

import { useContext } from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import { IMSContext } from "../ims/context";
import IncidentModel from "../ims/model/Incident";
import RodGarettAddress from "../ims/model/RodGarettAddress";

const Label = ({ id, label }) => {
  invariant(id != null, "id property is required");
  invariant(label != null, "label property is required");

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
            placeholder="One-line summary of incident"
          />
        </FormGroup>
      </Card.Body>
    </Card>
  );
};

const LocationCard = ({ locationName, locationDescription }) => {
  return (
    <Card>
      <Card.Body className="bg-light p-1">
        <FormGroup as={Row}>
          <Col sm={2}>
            <Label id="incident_location_name" label="Name" />
          </Col>
          <Col sm={10}>
            <LabeledTextField
              id="incident_location_name"
              value={locationName}
              placeholder="Name of location (camp, art project, …)"
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row}>
          <Col sm={2}>
            <Label id="incident_location_address" label="Address" />
          </Col>
          <Col sm={10}>
            <InputGroup id="incident_location_address">
              {/* FIXME: Can we set width via Bootstrap instead of style? */}
              <Form.Select
                id="incident_location_address_radial_hour"
                size="sm"
                style={{ flex: "initial", width: "5em" }}
              >
                {RodGarettAddress.radialStreetNames.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Form.Select>
              <InputGroup.Text>:</InputGroup.Text>
              {/* FIXME: Can we set width via Bootstrap instead of style? */}
              <Form.Select
                id="incident_location_address_radial_minute"
                size="sm"
                style={{ flex: "initial", width: "5em" }}
              >
                {RodGarettAddress.radialMinutes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Form.Select>
              <InputGroup.Text>@</InputGroup.Text>
              {/* FIXME: Can we set width via Bootstrap instead of style? */}
              <Form.Select
                id="incident_location_address_concentric"
                size="sm"
                style={{ flex: "initial", width: "20em" }}
              >
                {/* FIXME: 2019 street names; get event-specific names from IMS. */}
                {[
                  "Esplanade",
                  "A",
                  "B",
                  "C",
                  "D",
                  "E",
                  "F",
                  "G",
                  "H",
                  "I",
                  "J",
                  "K",
                  "L",
                  "3:00 B Plaza",
                  "3:00 G Plaza",
                  "4:30 B Plaza",
                  "4:30 G Plaza",
                  "Center Camp Plaza",
                  "Route 66",
                  "Rod's Ring Road",
                  "6:00 I Plaza",
                  "7:30 B Plaza",
                  "7:30 G Plaza",
                  "9:00 B Plaza",
                  "9:00 G Plaza",
                ].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup as={Row}>
          <Col sm={2}>
            <Label id="incident_location_description" label="Description" />
          </Col>
          <Col sm={10}>
            <LabeledTextField
              id="incident_location_description"
              value={locationDescription}
              placeholder="Description of location"
            />
          </Col>
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
