import { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router, Redirect, Route, Switch, useParams
} from "react-router-dom";

import {
  Authenticator, AuthenticatorContext, TestAuthentationSource
} from "./auth";
import Loading from "./components/Loading";

import "bootstrap/dist/css/bootstrap.min.css";

import { rootURL, homeURL, eventURL } from "./urls";


const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./routes/Home"));
const Event = lazy(() => import("./routes/Event"));
const NotFound = lazy(() => import("./routes/NotFound"));


export default class App extends Component {

  constructor(props) {
    super(props);

    this.authenticator = new Authenticator(new TestAuthentationSource());
  }

  render() {

    return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Switch>

            {/* Send root URL to Home screen URL */}
            <Route exact path={rootURL}>
              <Redirect to={homeURL} />
            </Route>

            <AuthenticatorContext.Provider value={this.authenticator}>

              {/* Home Screen */}
              <Route exact path={homeURL}>
                <Login>
                  <Home />
                </Login>
              </Route>

              {/* Event Screen */}
              <Route exact path={`${eventURL}:eventID/`}>
                <Login>
                  <EventWithParams />
                </Login>
              </Route>

            </AuthenticatorContext.Provider>

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


function EventWithParams() {
  let { eventID } = useParams();
  return (<Event id={eventID} />);
}
