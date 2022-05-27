import "@testing-library/jest-dom/extend-expect";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import {
  DispatchQueuePage,
  RoutedDispatchQueuePage,
} from "./DispatchQueuePage";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";

export const waitForIncidents = async () => {
  await waitForElementToBeRemoved(() => screen.getByText("Loading…"));
};

export const waitForEffects = async () => {
  await waitForIncidents();
};

describe("DispatchQueuePage component", () => {
  test("loading events", async () => {
    const ims = testIncidentManagementSystem();

    const event = await ims.eventWithID("1");
    renderWithIMSContext(<DispatchQueuePage eventID={event.id} />, ims);

    expect(screen.queryByText("Loading…")).toBeInTheDocument();
  });

  test("invalid event ID", async () => {
    const eventID = "XYZZY";

    renderWithIMSContext(<DispatchQueuePage eventID={eventID} />);

    expect(await screen.findByText("Error loading event")).toBeInTheDocument();
  });

  test("valid event ID", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      renderWithIMSContext(<DispatchQueuePage eventID={event.id} />, ims);

      // DispatchQueue component renders event name
      expect(
        await screen.findByText(`Dispatch Queue: ${event.name}`)
      ).toBeInTheDocument();
    }
  });
});

describe("RoutedDispatchQueuePage component", () => {
  test("Event ID: params -> props", async () => {
    const ims = testIncidentManagementSystem();

    const event = await ims.eventWithID("1");
    renderWithIMSContext(
      <MemoryRouter initialEntries={[`/events/${event.id}/queue`]}>
        <Routes>
          <Route
            path={"/events/:eventID/queue"}
            element={<RoutedDispatchQueuePage />}
          />
        </Routes>
      </MemoryRouter>,
      ims
    );

    waitForEffects();

    // DispatchQueue component renders event name
    expect(
      await screen.findByText(`Dispatch Queue: ${event.name}`)
    ).toBeInTheDocument();
  });
});
