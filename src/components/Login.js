import React from "react";

export default class Login extends React.Component {

  constructor(props) {
    if (props.user === undefined) {
      throw new Error("user is not defined");
    }

    super(props);

    this.state = {
      username: (props.user === null) ? "" : props.user,
      password: "",
    };
  }

  onUsernameChange = (event) => {
    this.setState({username: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  onLogin = async (event) => {
    event.preventDefault();

    if (this.props.login === undefined) {
      console.log("No login function defined.");
    }
    else {
      await this.props.login(this.state.username, this.state.password);
    }
  }

  render() {
    const user = this.props.user;

    if (user === null) {
      return (
        <form id="login_form">

          <p>Please provide your Ranger Secret Clubhouse credentials.</p>

          <div className="login_field">
            <label htmlFor="username_field">Ranger Handle or Email:</label>
            <input
              id="username_field"
              type="text"
              value={this.state.username}
              inputMode="latin-name"
              placeholder="Bucket"
              autoComplete="username email"
              minLength="1"
              required={true}
              onChange={this.onUsernameChange}
            />
          </div>

          <div className="login_field">
            <label htmlFor="password_field">Password:</label>
            <input
              id="password_field"
              type="password"
              inputMode="latin-prose"
              placeholder="password"
              autoComplete="current-password"
              onChange={this.onPasswordChange}
            />
          </div>

          <button onClick={this.onLogin}>Log In</button>

        </form>
      );
    }
    else {
      return <>{this.props.children}</>;
    }
  }

}
