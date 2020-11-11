import React from 'react';

class LoginButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const user = this.props.user;

    if (user === null) {
      return (
        <div>
          <label>You not currently logged in.</label>
          <button id="login" onClick={this.props.login}>
            Login
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <label>You are currently logged in as <code>{user}</code>.</label>
          <button id="logout" onClick={this.props.logout}>
            Logout
          </button>
        </div>
      );
    }
  }

}

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  login = (event) => {
    event.preventDefault()

    console.log("Logging in...")
    this.setState({ user: "Hubcap" });
  }

  logout = (event) => {
    event.preventDefault()

    console.log("Logging out...")
    this.setState({ user: null });
  }

  render() {
    const user = this.state.user;

    return (
      <div>
        <h1>Ranger Incident Management System</h1>
        <LoginButton
          login={this.login}
          logout={this.logout}
          user={user}
        />
      </div>
    );
  }

}
