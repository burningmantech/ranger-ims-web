import "@testing-library/jest-dom/extend-expect";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { URLs } from "../../URLs";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../../ims/TestIMS";
import { waitForNavEvents } from "../../test/wait";

import EventDropdown from "./EventDropdown";

describe("EventDropdown component", () => {
  test("id", async () => {
    renderWithIMSContext(<EventDropdown />, testIncidentManagementSystem());

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("loading events", async () => {
    const ims = testIncidentManagementSystem();

    renderWithIMSContext(<EventDropdown />, ims);

    const p = waitForNavEvents();

    for (const event of await ims.events()) {
      expect(screen.queryByText(event.name)).not.toBeInTheDocument();
    }

    await p;
  });

  test("events fail to load", async () => {
    const ims = testIncidentManagementSystem();

    ims.events = jest.fn(async () => {
      throw new Error("because reasons...");
    });
    console._suppressErrors();

    renderWithIMSContext(<EventDropdown />, ims);
    await userEvent.click(screen.getByText("Event"));

    expect(screen.getByText("Error loading events")).toBeInTheDocument();

    expect(console.warn).toHaveBeenCalledWith(
      "Unable to fetch events: because reasons...",
    );
  });

  test("no events loaded", async () => {
    const ims = testIncidentManagementSystem();

    ims.testData.events = [];

    renderWithIMSContext(<EventDropdown />, ims);
    await waitForNavEvents();

    expect(screen.getByText("No events found")).toBeInTheDocument();
  });

  test("event names", async () => {
    const ims = testIncidentManagementSystem();

    renderWithIMSContext(<EventDropdown />, ims);
    await waitForNavEvents();

    const eventNames = Array.from(
      document.getElementsByClassName("nav_event_id"),
      (item) => item.innerHTML,
    );
    const events = await ims.events();
    const expectedEventNames = events.map((event) => event.name);

    expect(eventNames).toEqual(expectedEventNames.sort());
  });

  test("event links", async () => {
    const ims = testIncidentManagementSystem();

    renderWithIMSContext(<EventDropdown />, ims);
    await waitForNavEvents();

    for (const event of await ims.events()) {
      const url = new URL(screen.getByText(event.name).href);
      expect(url.pathname).toEqual(URLs.event(event.id));
    }
  });
});
