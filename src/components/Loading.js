import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";


const Loading = (props) => {
  return (
    <Alert variant="light">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Alert>
  );
}

export default Loading;
