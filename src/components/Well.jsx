import invariant from "invariant";

import Card from "react-bootstrap/Card";

const Well = ({ children, id, title }) => {
  invariant(children != null, "children property is required");
  invariant(id != null, "id property is required");

  let Title;
  if (title == null) {
    Title = () => "";
  } else {
    Title = () => <Card.Title className="text-center">{title}</Card.Title>;
  }

  return (
    <Card id={id} className="m-2">
      <Card.Body className="bg-light p-2">
        <Title />
        {children}
      </Card.Body>
    </Card>
  );
};

export default Well;
