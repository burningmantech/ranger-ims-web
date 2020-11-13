import React, { Suspense, lazy } from "react";

const Login = lazy(() => import("../components/Login"));

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {user: null};
  }

  login = (event) => {
    event.preventDefault()

    console.log("Logging in...")
    this.setState({ user: "Hubcap" });
  }

  logout = (event) => {
    event.preventDefault()

    console.log("Logging out...")
    this.setState({user: null});
  }

  render() {
    const user = this.state.user;

    return (
      <>
        <h1>Ranger Incident Management System</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Login login={this.login} logout={this.logout} user={user}>
            Logged in stuff here...
          </Login>
        </Suspense>
      </>
    );
  }

}
