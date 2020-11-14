import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import User from "./auth";

const Home = lazy(() => import("./routes/Home"));

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {user: null};
  }

  login = async (username, password) => {
    console.log("Logging in as " + username + "...");
    this.setState({user: new User(username)});
  }

  logout = async () => {
    console.log("Logging out from user " + this.state.user + "...")
    this.setState({user: null});
  }

  render() {
    return (
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/">
              <Home
                user={this.state.user}
                login={this.login}
                logout={this.logout}
              />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    );
  }

}
