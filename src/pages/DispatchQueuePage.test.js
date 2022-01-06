import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import {
  DispatchQueuePage, RoutedDispatchQueuePage
} from "./DispatchQueuePage";

import {
  renderWithIMSContext, testIncidentManagementSystem
} from "../ims/TestIMS";


describe("DispatchQueuePage component", () => {

  test(
    "Loading", async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMSContext(<DispatchQueuePage id={event.id} />, ims);
          expect(screen.queryByText("Loading...")).toBeInTheDocument();
        });
      }
    }
  );

  test(
    "Invalid event ID", async () => {
      const eventID = "XYZZY";

      await act(async () => {
        renderWithIMSContext(<DispatchQueuePage id={eventID} />);
      });

      expect(screen.queryByText("Error loading event")).toBeInTheDocument();
    }
  );

  test(
    "Valid event ID", async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMSContext(<DispatchQueuePage id={event.id} />, ims);
        });

        // DispatchQueue component renders event name
        expect(
          screen.queryByText(`Dispatch Queue: ${event.name}`)
        ).toBeInTheDocument();
      }
    }
  );

});


describe("RoutedDispatchQueuePage component", () => {

  test(
    "Event ID: params -> props", async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMSContext(
            <MemoryRouter initialEntries={[`/events/${event.id}/queue`]}>
              <Routes>
                <Route path={"/events/:eventID/queue"} element={
                  <RoutedDispatchQueuePage />
                } />
              </Routes>
            </MemoryRouter>,
            ims
          );
        });

        // DispatchQueue component renders event name
        expect(
          screen.queryByText(`Dispatch Queue: ${event.name}`)
        ).toBeInTheDocument();
      }
    }
  );

});
