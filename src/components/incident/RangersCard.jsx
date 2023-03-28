import invariant from "invariant";

import Well from "../base/Well";

const RangersCard = ({ rangers }) => {
  invariant(rangers != null, "rangers property is required");

  return (
    <Well id="incident_rangers_card" title="Rangers">
      ...rangers card...
    </Well>
  );
};

export default RangersCard;
