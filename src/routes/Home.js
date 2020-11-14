import React, { Suspense, lazy } from "react";

const Login = lazy(() => import("../components/Login"));

export default class Home extends React.Component {

  render() {
    return (
      <>
        <h1>Ranger Incident Management System</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Login
            login={this.props.login}
            logout={this.props.logout}
            user={this.props.user}
          >
            Logged in stuff here...
          </Login>
        </Suspense>
      </>
    );
  }

}
