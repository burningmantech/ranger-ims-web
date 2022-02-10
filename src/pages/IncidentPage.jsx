import invariant from "invariant";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";
import Page from "../components/Page";
import Incident from "../components/Incident";

export const IncidentPage = ({ eventID, incidentNumber }) => {
  invariant(eventID != null, "eventID property is required");
  invariant(incidentNumber != null, "incidentNumber property is required");

  const imsContext = useContext(IMSContext);
  invariant(imsContext != null, "IMS context is required");
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  // Fetch data

  const [incident, setIncident] = useState(undefined);

  useEffect(() => {
    let ignore = false;

    const fetchIncident = async () => {
      let incident;
      try {
        incident = await ims.incidentWithNumber(eventID, incidentNumber);
      } catch (e) {
        console.error(`Unable to fetch incident: ${e.message}`);
        console.error(e);
        incident = null;
      }

      if (!ignore) {
        setIncident(incident);
      }
    };

    fetchIncident();

    return () => {
      ignore = true;
    };
  }, [ims, eventID, incidentNumber]);

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
    "eventID parameter is required: " + JSON.stringify(params)
  );
  invariant(
    params.incidentNumber != null,
    "incidentNumber parameter is required: " + JSON.stringify(params)
  );

  return (
    <IncidentPage
      eventID={params.eventID}
      incidentNumber={parseInt(params.incidentNumber)}
    />
  );
};

export default RoutedIncidentPage;
