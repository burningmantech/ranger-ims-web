import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = lazy(() => import("./routes/Home"));

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {user: null};
  }

  login = (username, password) => {
    console.log("Logging in as " + username + "...");
    this.setState({user: username});
  }

  logout = () => {
    console.log("Logging out from user " + this.state.user + "...")
    this.setState({user: null});
  }

  render() {
    const user = this.state.user;

    return (
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/">
              <Home user={user} login={this.login} logout={this.logout} />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    );
  }

}
