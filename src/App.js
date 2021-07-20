/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }]*/

import invariant from "invariant";
import { Suspense, lazy, useState } from "react";
import {
  BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { URLs } from "./URLs";
import { IMSContext } from "./ims/context";

import Loading from "./components/Loading";

import "./App.css";


const Login = lazy(() => import("./components/Login"));
const HomePage = lazy(() => import("./routes/HomePage"));
const RoutedEventPage = lazy(() => import("./routes/EventPage"));
const AdminPage = lazy(() => import("./routes/AdminPage"));
const NotFoundPage = lazy(() => import("./routes/NotFoundPage"));


const App = (props) => {
  invariant(props.ims != null, "ims property is required");

  const [_user, setUser] = useState(null);

  // Get notified when login/logout happens
  props.ims.delegate = () => { setUser(props.ims.user); }

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>

          {/* Send root URL to Home page URL */}
          <Route exact path={URLs.root}>
            <Redirect to={URLs.home} />
          </Route>

          <IMSContext.Provider value={{ims: props.ims}}>

            {/* Home Page */}
            <Route exact path={URLs.home}>
              <Login>
                <HomePage />
              </Login>
            </Route>

            {/* Event Page */}
            <Route exact path={`${URLs.events}:eventID/`}>
              <Login>
                <RoutedEventPage />
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

export default App;
