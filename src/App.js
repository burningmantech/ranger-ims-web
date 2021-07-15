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
const HomePage = lazy(() => import("./routes/HomePage"));
const EventPage = lazy(() => import("./routes/EventPage"));
const AdminPage = lazy(() => import("./routes/AdminPage"));
const NotFoundPage = lazy(() => import("./routes/NotFoundPage"));


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

            {/* Send root URL to Home page URL */}
            <Route exact path={URLs.root}>
              <Redirect to={URLs.home} />
            </Route>

            <IMSContext.Provider value={imsContextValue}>

              {/* Home Page */}
              <Route exact path={URLs.home}>
                <Login>
                  <HomePage />
                </Login>
              </Route>

              {/* Event Page */}
              <Route exact path={`${URLs.events}:eventID/`}>
                <Login>
                  <EventPageWithParams />
                </Login>
              </Route>

              {/* Admin Page */}
              <Route exact path={URLs.admin}>
                <Login>
                  <AdminPage />
                </Login>
              </Route>

            </IMSContext.Provider>

            {/* Not found */}
            <Route path="*">
              <NotFoundPage />
            </Route>

          </Switch>
        </Suspense>
      </Router>
    );
  }

}


/* FIXME: figure out how to use params from the EventPage class */
function EventPageWithParams() {
  let { eventID } = useParams();
  return (<EventPage id={eventID} />);
}
