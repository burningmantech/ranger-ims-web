import { Component } from "react";

import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";


export default class Loading extends Component {

  render() {
    return (
      <Alert variant="light">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Alert>
    );
  }

}
