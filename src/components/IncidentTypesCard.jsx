import invariant from "invariant";

import ListGroup from "react-bootstrap/ListGroup";

import Well from "./Well";

const IncidentTypesCard = ({ incidentTypes }) => {
  invariant(incidentTypes != null, "incidentTypes property is required");

  return (
    <Well id="incident_types_card" title="Incident Types">
      <ListGroup>
        {incidentTypes
          .sort()
          .map((incidentType) => [
            <ListGroup.Item key={incidentType}>{incidentType}</ListGroup.Item>,
          ])}
      </ListGroup>
    </Well>
  );
};

export default IncidentTypesCard;
