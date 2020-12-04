import { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router, Redirect, Route, Switch, useParams
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { Authenticator, TestAuthentationSource } from "./auth";
import { AuthenticatorContext, IMSContext } from "./context";
import IncidentManagementSystem from "./ims/IMS";
import { URLs } from "./URLs";

import Loading from "./components/Loading";

import "./App.css";


const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./routes/Home"));
const Event = lazy(() => import("./routes/Event"));
const Admin = lazy(() => import("./routes/Admin"));
const NotFound = lazy(() => import("./routes/NotFound"));

const imsURL = new URL("http://localhost/ims/api/bag");


export default class App extends Component {

  constructor(props) {
    super(props);

    this.authenticator = new Authenticator(new TestAuthentationSource());
    this.ims = new IncidentManagementSystem(imsURL);

    this.state = {
      user: this.authenticator.user,
    }

    // Get notified when login/logout happens
    this.authenticator.delegate = () => {
      this.setState({user: this.authenticator.user})
    }
  }

  render = () => {
    const authContextValue = {authenticator: this.authenticator};
    const imsContextValue = {ims: this.ims};

    return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Switch>

            {/* Send root URL to Home screen URL */}
            <Route exact path={URLs.root}>
              <Redirect to={URLs.home} />
            </Route>

            <AuthenticatorContext.Provider value={authContextValue}>
              <IMSContext.Provider value={imsContextValue}>

                {/* Home Screen */}
                <Route exact path={URLs.home}>
                  <Login>
                    <Home />
                  </Login>
                </Route>

                {/* Event Screen */}
                <Route exact path={`${URLs.event}:eventID/`}>
                  <Login>
                    <EventWithParams />
                  </Login>
                </Route>

                {/* Admin Console */}
                <Route exact path={URLs.admin}>
                  <Login>
                    <Admin />
                  </Login>
                </Route>

              </IMSContext.Provider>
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


/* FIXME: figure out how to use params from the Event class */
function EventWithParams() {
  let { eventID } = useParams();
  return (<Event id={eventID} />);
}
