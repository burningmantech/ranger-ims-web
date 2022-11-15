import invariant from "invariant";

import { useContext, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { IMSContext } from "../ims/context";
import { useConcentricStreets } from "../ims/effects";

import AttachedIncidentReportsCard from "./AttachedIncidentReportsCard";
import IncidentTypesCard from "./IncidentTypesCard";
import LocationCard from "./LocationCard";
import NarrativeCard from "./NarrativeCard";
import RangersCard from "./RangersCard";
import SelectPriority from "./SelectPriority";
import SelectState from "./SelectState";
import SummaryCard from "./SummaryCard";

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

  // Incident State

  const [incidentState, setIncidentState] = useState(incident.state);

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

  const editIncident = async (event, edit) => {
    console.debug(event);
    const control = event.target;

    controlIsBusy(control);
    let updateControl = controlHadSuccess;
    try {
      await edit(control.value);
    } catch (e) {
      updateControl = controlHadError;
    }
    updateControl(control);
  };

  const changeState = async (event) => {
    await editIncident(event, ims.setIncidentState);
  };

  const changePriority = async (event) => {
    await editIncident(event, ims.setIncidentPriority);
  };

  // Component

  return (
    <div id="incident_wrapper">
      <h1>Incident #{incident.number}</h1>

      <Row>
        <Col className="text-start" />
        <Col className="text-center">
          <SelectState state={incidentState} onChange={changeState} />
        </Col>
        <Col className="text-end">
          <SelectPriority
            priority={incident.priority}
            onChange={changePriority}
          />
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
