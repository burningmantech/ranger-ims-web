import "@testing-library/jest-dom/extend-expect";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import {
  DispatchQueuePage, RoutedDispatchQueuePage
} from "./DispatchQueuePage";

import {
  renderWithIMSContext, testIncidentManagementSystem
} from "../ims/TestIMS";


describe("DispatchQueuePage component", () => {

  test(
    "loading events", async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        renderWithIMSContext(<DispatchQueuePage id={event.id} />, ims);

        expect(screen.queryByText("Loading...")).toBeInTheDocument();
        cleanup();
      }
    }
  );

  test(
    "invalid event ID", async () => {
      const eventID = "XYZZY";

      renderWithIMSContext(<DispatchQueuePage id={eventID} />);

      expect(
        await screen.findByText("Error loading event")
      ).toBeInTheDocument();
    }
  );

  test(
    "valid event ID", async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        renderWithIMSContext(<DispatchQueuePage id={event.id} />, ims);

        // DispatchQueue component renders event name
        expect(
          await screen.findByText(`Dispatch Queue: ${event.name}`)
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

        // DispatchQueue component renders event name
        expect(
          await screen.findByText(`Dispatch Queue: ${event.name}`)
        ).toBeInTheDocument();
      }
    }
  );

});
