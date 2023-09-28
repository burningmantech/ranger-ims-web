import invariant from "invariant";

import ItemListCard from "../base/ItemListCard";

const IncidentTypesCard = ({ incidentTypes }) => {
  invariant(incidentTypes != null, "incidentTypes property is required");

  return (
    <ItemListCard
      id="incident_types_card"
      title="Incident Types"
      items={incidentTypes}
    />
  );
};

export default IncidentTypesCard;
