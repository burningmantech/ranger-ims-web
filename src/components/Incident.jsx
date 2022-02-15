import invariant from "invariant";

import { useContext, useEffect, useState } from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
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

const Select = ({ id, width, selected, options }) => {
  {
    /* FIXME: Can we set width via Bootstrap instead of style? */
  }
  return (
    <Form.Select
      id={id}
      size="sm"
      style={{ flex: "initial", width: width }}
      value={selected}
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

const LocationCard = ({
  locationName,
  locationDescription,
  locationConcentric,
  locationRadialHour,
  locationRadialMinute,
  concentricStreets,
}) => {
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
              <Select
                id="incident_location_address_radial_hour"
                width="5em"
                selected={locationRadialHour}
                options={RodGarettAddress.radialHours.map((value) => [
                  value,
                  value,
                ])}
              />
              <InputGroup.Text>:</InputGroup.Text>
              <Select
                id="incident_location_address_radial_minute"
                width="5em"
                selected={locationRadialMinute}
                options={RodGarettAddress.radialMinutes.map((value) => [
                  value,
                  value,
                ])}
              />
              <InputGroup.Text>@</InputGroup.Text>
              <Select
                id="incident_location_address_concentric"
                width="20em"
                selected={locationConcentric}
                options={Array.from(concentricStreets, ([id, street]) => [
                  street.id,
                  street.name,
                ])}
              />
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

  // Fetch concentric street data

  const [concentricStreets, setConcentricStreets] = useState([]);

  useEffect(() => {
    let ignore = false;

    const fetchConcentricStreets = async () => {
      let concentricStreets;
      try {
        concentricStreets = await ims.concentricStreets(incident.eventID);
      } catch (e) {
        console.error(`Unable to fetch concentric streets: ${e.message}`);
        console.error(e);
        concentricStreets = [];
      }

      if (!ignore) {
        setConcentricStreets(concentricStreets);
      }
    };

    fetchConcentricStreets();

    return () => {
      ignore = true;
    };
  }, [ims, incident.eventID]);

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
          <LocationCard
            locationName={incident.location.name}
            locationDescription={incident.location.address.description}
            locationConcentric={incident.location.address.concentric}
            locationRadialHour={incident.location.address.radialHour}
            locationRadialMinute={incident.location.address.radialMinute}
            concentricStreets={concentricStreets}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Incident;
