import { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router, Redirect, Route, Switch, useParams
} from "react-router-dom";

import { AuthenticatorContext, authenticator } from "./auth";
import Loading from "./components/Loading";

import "bootstrap/dist/css/bootstrap.min.css";


const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./routes/Home"));
const Event = lazy(() => import("./routes/Event"));
const NotFound = lazy(() => import("./routes/NotFound"));


export default class App extends Component {

  render() {
    return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Switch>

            {/* Send root URL to Home screen URL */}
            <Route exact path="/">
              <Redirect to="/ims/" />
            </Route>

            <AuthenticatorContext.Provider value={authenticator}>

              {/* Home Screen */}
              <Route exact path="/ims/">
                <Login>
                  <Home />
                </Login>
              </Route>

              {/* Event Screen */}
              <Route exact path="/ims/event/:eventID/">
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
