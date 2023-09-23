import invariant from "invariant";

import ItemListCard from "../base/ItemListCard";

const RangersCard = ({ rangerHandles }) => {
  invariant(rangerHandles != null, "rangerHandles property is required");

  return (
    <ItemListCard id="rangers_card" title="Rangers" items={rangerHandles} />
  );
};

export default RangersCard;
