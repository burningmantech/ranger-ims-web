import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import {
  DispatchQueuePage,
  RoutedDispatchQueuePage,
} from "./DispatchQueuePage";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";
import {
  waitForConcentricStreets,
  waitForEvent,
  waitForIncidents,
} from "../test/wait";

export const waitForEffects = async () => {
  await waitForEvent();
  await Promise.all([waitForIncidents(), waitForConcentricStreets()]);
};

describe("DispatchQueuePage component", () => {
  test("loading event", async () => {
    const ims = testIncidentManagementSystem();

    const event = await ims.eventWithID("1");
    renderWithIMSContext(<DispatchQueuePage eventID={event.id} />, ims);

    expect(screen.getByText("Loading event…")).toBeInTheDocument();

    await waitForEffects();
  });

  test("invalid event ID", async () => {
    const eventID = "XYZZY";

    console._suppressErrors();

    renderWithIMSContext(<DispatchQueuePage eventID={eventID} />);

    expect(
      await screen.findByText("Failed to load event.")
    ).toBeInTheDocument();
  });

  test("valid event ID", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      renderWithIMSContext(<DispatchQueuePage eventID={event.id} />, ims);
      await waitForEffects();

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
    await waitForEffects();

    // DispatchQueue component renders event name
    expect(
      await screen.findByText(`Dispatch Queue: ${event.name}`)
    ).toBeInTheDocument();
  });
});
