import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { act, render, screen } from "@testing-library/react";
import { Route, Router, Switch } from "react-router-dom";

import { Event } from "../ims/model/Event";
import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";

import { EventPage } from "./EventPage";
import RoutedEventPage from "./EventPage";


describe("EventPage component", () => {

  test("loading event", async () => {
    const ims = testIncidentManagementSystem();
    const eventID = "1";

    renderWithIMS(
      <EventPage id={eventID} />, ims
    );

    expect(screen.queryByText(`Loading...`)).toBeInTheDocument();
  });

  test("event fails to load", async () => {
    const ims = testIncidentManagementSystem();
    const eventID = "1";

    ims.eventWithID = jest.fn(
      (id) => { throw new Error("Can't load event because reasons..."); }
    );

    const spy = jest.spyOn(console, "error");

    renderWithIMS(
      <EventPage id={eventID} />, ims
    );

    expect(screen.queryByText("Error loading event")).toBeInTheDocument();

    expect(spy).toHaveBeenCalledWith(
      "Unable to load EventPage: Can't load event because reasons..."
    );
  });

  test("event loads after unmount", async () => {
    const ims = testIncidentManagementSystem();
    const eventID = "1";

    let done;
    const promise = new Promise((resolve, reject) => { done = resolve; });

    class TestEventPage extends EventPage {
      fetch = () => {
        console.info("Starting fetch...");
        return promise.then(() => {
          console.info("...done fetching");
          this._setEvent(ims.eventWithID(eventID));
        });
      }
    }

    const container = renderWithIMS(
      (<TestEventPage id={eventID} />), ims
    );

    container.unmount();

    const spy = jest.spyOn(console, "debug");

    done();
    await promise;

    expect(spy).toHaveBeenCalledWith(
      "Received event after TestEventPage unmounted."
    );
  });

  test("heading", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      await act(async () => {
        renderWithIMS(
          <EventPage id={event.id} />, ims
        );
      });

      expect(screen.queryByText(`Event: ${event.name}`)).toBeInTheDocument();
    }
  });

});


describe("RoutedEventPage component", () => {

  test("eventID in routed properties", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      const history = createMemoryHistory();
      const route = `/events/${event.id}`;
      history.push(route);

      await act(async () => {
        renderWithIMS(
          (
            <Router history={history}>
              <Switch>
                <Route exact path="/events/:eventID/">
                  <RoutedEventPage />
                </Route>
              </Switch>
            </Router>
          ),
          ims,
        );
      });

      expect(screen.queryByText(`Event: ${event.name}`)).toBeInTheDocument();
    }
  });

});


const matchProperty = (eventID) => {
  return { params: { eventID: eventID } };
}
