import invariant from "invariant";
import { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router, Redirect, Route, Switch, useParams
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { URLs } from "./URLs";
import { IMSContext } from "./ims/context";

import Loading from "./components/Loading";

import "./App.css";


const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./routes/Home"));
const Event = lazy(() => import("./routes/Event"));
const Admin = lazy(() => import("./routes/Admin"));
const NotFound = lazy(() => import("./routes/NotFound"));


export default class App extends Component {

  constructor(props) {
    super(props);

    invariant(props.ims != null, "ims is required");

    this.state = {
      user: props.ims.user,
    }

    // Get notified when login/logout happens
    props.ims.delegate = () => {
      this.setState({ user: props.ims.user })
    }
  }

  render = () => {
    const imsContextValue = {ims: this.props.ims};

    return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Switch>

            {/* Send root URL to Home screen URL */}
            <Route exact path={URLs.root}>
              <Redirect to={URLs.home} />
            </Route>

            <IMSContext.Provider value={imsContextValue}>

              {/* Home Screen */}
              <Route exact path={URLs.home}>
                <Login>
                  <Home />
                </Login>
              </Route>

              {/* Event Screen */}
              <Route exact path={`${URLs.events}:eventID/`}>
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
