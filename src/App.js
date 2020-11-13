import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = lazy(() => import("./routes/Home"));

export default class App extends React.Component {

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
