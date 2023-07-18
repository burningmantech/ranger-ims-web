import invariant from "invariant";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { IMSContext } from "../ims/context";
import { useIncident } from "../ims/effects";

import Loading from "../components/base/Loading";
import Incident from "../components/Incident";
import Page from "../components/Page";

export const IncidentPage = ({ eventID, incidentNumber }) => {
  invariant(eventID != null, "eventID property is required");
  invariant(incidentNumber != null, "incidentNumber property is required");

  const imsContext = useContext(IMSContext);
  invariant(imsContext != null, "IMS context is required");
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  // Fetch data

  const [incident, setIncident] = useState(undefined);

  useIncident({
    eventID: eventID,
    incidentNumber: incidentNumber,
    setIncident: setIncident,
  });

  // Render

  if (incident === undefined) {
    return <Loading />;
  } else if (incident === null) {
    return "Error loading incident";
  }

  return (
    <Page>
      <Incident incident={incident} />
    </Page>
  );
};

export const RoutedIncidentPage = () => {
  const params = useParams();

  invariant(
    params.eventID != null,
    "eventID parameter is required: " + JSON.stringify(params),
  );
  invariant(
    params.incidentNumber != null,
    "incidentNumber parameter is required: " + JSON.stringify(params),
  );

  return (
    <IncidentPage
      eventID={params.eventID}
      incidentNumber={parseInt(params.incidentNumber)}
    />
  );
};

export default RoutedIncidentPage;
