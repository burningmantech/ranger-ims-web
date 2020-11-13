import React from "react";

export default class Login extends React.Component {

  render() {
    const user = this.props.user;

    if (user === null) {
      return (
        <button type="button" onClick={this.props.login}>
          Log In
        </button>
      );
    } else {
      return (
        <div>You are currently logged in as <code>{user}</code>.</div>
      );
    }
  }

}
