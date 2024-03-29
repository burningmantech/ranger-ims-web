import invariant from "invariant";

import ListGroup from "react-bootstrap/ListGroup";

import Well from "./Well";

const ItemListCard = ({ id, title, items }) => {
  invariant(id != null, "id property is required");
  invariant(title != null, "title property is required");
  invariant(items != null, "items property is required");

  return (
    <Well id={id} title={title} size="sm">
      <ListGroup>
        {items
          .sort()
          .map((item, index) => [
            <ListGroup.Item key={index}>{item}</ListGroup.Item>,
          ])}
      </ListGroup>
    </Well>
  );
};

export default ItemListCard;
