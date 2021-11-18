import invariant from "invariant";
import { useContext, useEffect, useState } from "react";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";


const DispatchQueue = (props) => {
  invariant(props.event != null, "event property is required");

  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  // Fetch data

  const [incidents, setIncidents] = useState(undefined);

  useEffect(
    () => {
      let ignore = false;

      const fetchIncidents = async () => {
        let incidents;
        try {
          incidents = await ims.incidents();
        }
        catch (e) {
          console.error(`Unable to fetch incidents: ${e.message}`);
          incidents = null;
        }

        if (! ignore) { setIncidents(incidents); }
      }

      fetchIncidents();

      return () => { ignore = true; }
    }, [ims, props.event]
  );

  // Render

  if (incidents === undefined) {
    return <Loading />;
  } else if (incidents === null) {
    return "Error loading incidents";
  } else {
    return (
      <h1>Dispatch Queue: {props.event.name}</h1>
    );
  }
}

export default DispatchQueue;
