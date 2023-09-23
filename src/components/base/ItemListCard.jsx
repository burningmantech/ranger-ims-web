import invariant from "invariant";

import ListGroup from "react-bootstrap/ListGroup";

import Well from "./Well";

const ItemListCard = ({ id, title, items }) => {
  invariant(id != null, "id property is required");
  invariant(title != null, "title property is required");
  invariant(items != null, "items property is required");

  return (
    <Well id={id} title={title}>
      <ListGroup>
        {items
          .sort()
          .map((item) => [<ListGroup.Item key={item}>{item}</ListGroup.Item>])}
      </ListGroup>
    </Well>
  );
};

export default ItemListCard;
