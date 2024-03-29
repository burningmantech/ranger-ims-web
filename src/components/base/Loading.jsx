import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

const Loading = ({ what, condition, error, children }) => {
  if (condition) {
    return <>{children}</>;
  } else if (error) {
    return (
      <Alert variant="danger">
        {what == null ? "Failed to load." : `Failed to load ${what}.`}
      </Alert>
    );
  } else {
    return (
      <Alert variant="light">
        <Spinner animation="border" role="status" />
        {what == null ? "Loading…" : `Loading ${what}…`}
      </Alert>
    );
  }
};

export default Loading;
