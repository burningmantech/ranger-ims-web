import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { URLs } from "../URLs";
import { Event } from "../ims/model/Event";
import {
  renderWithIMSContext, testIncidentManagementSystem
} from "../ims/TestIMS";

import { EventPage } from "./EventPage";
import RoutedEventPage from "./EventPage";


describe("EventPage component", () => {

  test(
    "loading event",
    async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMSContext(<EventPage id={event.id} />);
          expect(screen.queryByText(`Loading...`)).toBeInTheDocument();
        });
        break;
      }
    }
  );

  test(
    "event fails to load",
    async () => {
      const ims = testIncidentManagementSystem();

      ims.eventWithID = jest.fn(
        (id) => { throw new Error("because reasons..."); }
      );

      const spy = jest.spyOn(console, "error");

      for (const event of await ims.events()) {
        renderWithIMSContext(<EventPage id={eventID} />, ims);

        expect(screen.queryByText("Error loading event")).toBeInTheDocument();

        expect(spy).toHaveBeenCalledWith(
          "Unable to fetch event: because reasons..."
        );
        break;
      }
    }
  );

  test(
    "heading",
    async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMSContext(<EventPage id={event.id} />, ims);
        });

        expect(screen.queryByText(`Event: ${event.name}`)).toBeInTheDocument();
      }
    }
  );

});


describe("RoutedEventPage component", () => {

  test(
    "eventID in routed properties",
    async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMSContext(
            (
              <MemoryRouter initialEntries={[URLs.event(event)]}>
                <Routes>
                  <Route
                    path={`${URLs.events}:eventID/`}
                    element={<RoutedEventPage />}
                  />
                </Routes>
              </MemoryRouter>
            ),
            ims,
          );
        });

        expect(screen.queryByText(`Event: ${event.name}`)).toBeInTheDocument();
      }
    }
  );

});


const matchProperty = (eventID) => {
  return { params: { eventID: eventID } };
}
