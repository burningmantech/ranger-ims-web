import { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router, Redirect, Route, Switch, useParams
} from "react-router-dom";

import { User } from "./auth";
import Loading from "./components/Loading";

import "bootstrap/dist/css/bootstrap.min.css";


const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./routes/Home"));
const Event = lazy(() => import("./routes/Event"));
const NotFound = lazy(() => import("./routes/NotFound"));


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {user: null};
  }

  login = async (username, password) => {
    console.log("Logging in as " + username + "...");
    this.setState({user: new User(username)});
  }

  logout = async () => {
    console.log("Logging out as " + this.state.user + "...")
    this.setState({user: null});
  }

  render() {
    return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Switch>

            {/* Send root URL to Home screen URL */}
            <Route exact path="/">
              <Redirect to="/ims/" />
            </Route>

            {/* Home Screen */}
            <Route exact path="/ims/">
              <Login login={this.login} user={this.state.user}>
                <Home user={this.state.user} />
              </Login>
            </Route>

            {/* Event Screen */}
            <Route exact path="/ims/event/:eventID/">
              <Login login={this.login} user={this.state.user}>
                <EventWithParams />
              </Login>
            </Route>

            {/* Not found */}
            <Route path="*">
              <NotFound />
            </Route>

          </Switch>
        </Suspense>
      </Router>
    );
  }

}


function EventWithParams () {
  let { eventID } = useParams();
  return (<Event id={eventID} />);
}
