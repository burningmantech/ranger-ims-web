import React from "react";

export default class Login extends React.Component {

  constructor(props) {
    super(props);

    if (props.user === undefined) {
      throw "user is not defined";
    }
  }

  onLogin = (event) => {
    event.preventDefault();

    if (this.props.login === undefined) {
      console.log("No login function defined.");
    }
    else {
      this.props.login("Hubcap", "*");
    }
  }

  render() {
    const user = this.props.user;

    if (user === null) {
      return (
        <button type="button" onClick={this.onLogin}>
          Log In
        </button>
      );
    }
    else {
      return (
        <div>You are currently logged in as {user}</div>
      )
    }
  }

}
