import invariant from "invariant";

import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import RodGarettAddress from "../ims/model/RodGarettAddress";

import FormGroup from "./FormGroup";
import Label from "./Label";
import LabeledTextField from "./LabeledTextField";
import Select from "./Select";
import Well from "./Well";

const LocationCard = ({
  locationName,
  setLocationName,
  locationDescription,
  setLocationDescription,
  locationConcentric,
  setLocationConcentric,
  locationRadialHour,
  setLocationRadialHour,
  locationRadialMinute,
  setLocationRadialMinute,
  concentricStreets,
}) => {
  invariant(setLocationName != null, "setLocationName property is required");
  invariant(
    setLocationDescription != null,
    "setLocationDescription property is required"
  );
  invariant(
    setLocationConcentric != null,
    "setLocationConcentric property is required"
  );
  invariant(
    setLocationRadialHour != null,
    "setLocationRadialHour property is required"
  );
  invariant(
    setLocationRadialMinute != null,
    "setLocationRadialMinute property is required"
  );

  return (
    <Well id="incident_location_card" title="Location">
      <FormGroup as={Row}>
        <Col sm={2}>
          <Label id="incident_location_name" label="Name" />
        </Col>
        <Col sm={10}>
          <LabeledTextField
            id="incident_location_name"
            value={locationName == null ? "" : locationName}
            setValue={setLocationName}
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
              width="auto"
              value={locationRadialHour == null ? "" : locationRadialHour}
              setValue={(s) => setLocationRadialHour(parseInt(s))}
              values={[""]
                .concat(RodGarettAddress.radialHours)
                .map((h) => [h, h])}
            />
            <InputGroup.Text>:</InputGroup.Text>
            <Select
              id="incident_location_address_radial_minute"
              width="5em"
              value={locationRadialMinute == null ? "" : locationRadialMinute}
              setValue={(s) => setLocationRadialMinute(parseInt(s))}
              values={[""]
                .concat(RodGarettAddress.radialMinutes)
                .map((m) => [m, m])}
            />
            <InputGroup.Text>@</InputGroup.Text>
            <Select
              id="incident_location_address_concentric"
              width="20em"
              value={locationConcentric == null ? "" : locationConcentric}
              setValue={setLocationConcentric}
              values={[["", ""]].concat(
                concentricStreets.map((c) => [c.id, c.name])
              )}
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
            value={locationDescription == null ? "" : locationDescription}
            setValue={setLocationDescription}
            placeholder="Description of location"
          />
        </Col>
      </FormGroup>
    </Well>
  );
};

export default LocationCard;
