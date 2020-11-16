import React from "react";


export default class NotFound extends React.Component {

  render() {
    return (
      <>
        Resource not found: <code>{window.location.href}</code>
      </>
    );
  }

}
