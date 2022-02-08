/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }]*/

import invariant from "invariant";
import { Suspense, lazy, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { URLs } from "./URLs";
import { IMSContext } from "./ims/context";

import Loading from "./components/Loading";

import "./App.css";

const Login = lazy(() => import("./components/Login"));
const HomePage = lazy(() => import("./pages/HomePage"));
const EventPage = lazy(() => import("./pages/EventPage"));
const DispatchQueuePage = lazy(() => import("./pages/DispatchQueuePage"));
const IncidentPage = lazy(() => import("./pages/IncidentPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const App = (props) => {
  invariant(props.ims != null, "ims property is required");

  let Router;
  if (props.router == null) {
    Router = BrowserRouter;
  } else {
    Router = props.router;
  }

  const [_user, setUser] = useState(null);

  // Get notified when login/logout happens
  props.ims.delegate = () => {
    setUser(props.ims.user);
  };

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <IMSContext.Provider value={{ ims: props.ims }}>
          <Routes>
            {/* Redirect root to IMS */}
            <Route path="/" element={<Navigate to={URLs.ims} />} />

            {/* Home Page */}
            <Route
              path={URLs.ims}
              element={
                <Login>
                  <HomePage />
                </Login>
              }
            />

            {/* Event Page */}
            <Route
              path={`${URLs.events}:eventID/`}
              element={
                <Login>
                  <EventPage />
                </Login>
              }
            />

            {/* Dispatch Queue Page */}
            <Route
              path={`${URLs.events}:eventID/queue`}
              element={
                <Login>
                  <DispatchQueuePage />
                </Login>
              }
            />

            {/* Incident Page */}
            <Route
              path={`${URLs.events}:eventID/incidents/:incidentNumber`}
              element={
                <Login>
                  <IncidentPage />
                </Login>
              }
            />

            {/* Admin Page */}
            <Route
              path={URLs.admin}
              element={
                <Login>
                  <AdminPage />
                </Login>
              }
            />

            {/* Not found */}
            <Route
              path="*"
              element={
                <Login>
                  <NotFoundPage />
                </Login>
              }
            />
          </Routes>
        </IMSContext.Provider>
      </Suspense>
    </Router>
  );
};

export default App;
