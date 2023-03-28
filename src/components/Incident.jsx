import invariant from "invariant";

import { useContext, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { IMSContext } from "../ims/context";
import { useConcentricStreets } from "../ims/effects";

import AttachedIncidentReportsCard from "./incident/AttachedIncidentReportsCard";
import IncidentTypesCard from "./incident/IncidentTypesCard";
import LocationCard from "./incident/LocationCard";
import NarrativeCard from "./incident/NarrativeCard";
import RangersCard from "./incident/RangersCard";
import SelectPriority from "./incident/SelectPriority";
import SelectState from "./incident/SelectState";
import SummaryCard from "./incident/SummaryCard";

const Incident = ({ incident }) => {
  invariant(incident != null, "incident property is required");

  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  // Fetch concentric street data

  const [concentricStreets, setConcentricStreets] = useState([]);

  useConcentricStreets({
    eventID: incident.eventID,
    setConcentricStreets: setConcentricStreets,
  });

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

      <Row>
        <Col>
          <RangersCard rangers={[]} />
        </Col>
        <Col>
          <IncidentTypesCard incidentTypes={incident.incidentTypes} />
        </Col>
      </Row>

      <Row>
        <Col>
          <AttachedIncidentReportsCard />
        </Col>
      </Row>

      <Row>
        <Col>
          <NarrativeCard />
        </Col>
      </Row>
    </div>
  );
};

export default Incident;
