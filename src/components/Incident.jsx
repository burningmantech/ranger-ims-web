import invariant from "invariant";

import { useContext } from "react";

import { IMSContext } from "../ims/context";

const Incident = (props) => {
  invariant(props.incident != null, "incident property is required");

  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  const incident = props.incident;

  return (
    <div id="incident_wrapper">
      <h1>Incident #{incident.number}</h1>
    </div>
  );
};

export default Incident;
