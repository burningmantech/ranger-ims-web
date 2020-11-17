import { Component } from "react";


export default class NotFound extends Component {

  render() {
    return (
      <>
        Resource not found: <code>{window.location.href}</code>
      </>
    );
  }

}
