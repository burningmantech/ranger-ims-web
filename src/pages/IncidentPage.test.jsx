import { cleanup, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { IncidentPage, RoutedIncidentPage } from "./IncidentPage";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";

describe("IncidentPage component", () => {
  test("loading incident", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(
          <IncidentPage eventID={event.id} incidentNumber={incident.number} />,
          ims,
        );

        expect(screen.getByText("Loading…")).toBeInTheDocument();

        cleanup();
      }
    }
  });

  test("invalid event ID", async () => {
    console._suppressErrors();

    renderWithIMSContext(<IncidentPage eventID="XYZZY" incidentNumber="1" />);

    expect(
      await screen.findByText("Error loading incident"),
    ).toBeInTheDocument();
  });

  test("invalid incident number", async () => {
    console._suppressErrors();

    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      renderWithIMSContext(
        <IncidentPage eventID={event.id} incidentNumber="XYZZY" />,
        ims,
      );

      expect(
        await screen.findByText("Error loading incident"),
      ).toBeInTheDocument();

      cleanup();
    }
  });

  test("valid event ID and incident number", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(
          <IncidentPage eventID={event.id} incidentNumber={incident.number} />,
          ims,
        );

        // Incident component renders event name
        expect(
          await screen.findByText(`Incident #${incident.number}`),
        ).toBeInTheDocument();

        cleanup();
      }
    }
  });
});

describe("RoutedIncidentPage component", () => {
  test("Event ID and incident number: params -> props", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(
          <MemoryRouter
            initialEntries={[
              `/events/${event.id}/incidents/${incident.number}`,
            ]}
          >
            <Routes>
              <Route
                path={"/events/:eventID/incidents/:incidentNumber"}
                element={<RoutedIncidentPage />}
              />
            </Routes>
          </MemoryRouter>,
          ims,
        );

        // Incident component renders event name
        expect(
          await screen.findByText(`Incident #${incident.number}`),
        ).toBeInTheDocument();

        cleanup();
      }
    }
  });
});
