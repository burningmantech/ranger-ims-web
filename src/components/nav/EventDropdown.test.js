import "@testing-library/jest-dom/extend-expect";

import { act, render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { URLs } from "../../URLs";
import { renderWithIMS, testIncidentManagementSystem } from "../../ims/TestIMS";

import EventDropdown from "./EventDropdown";


describe("EventDropdown component", () => {

  test("id", () => {
    renderWithIMS(<EventDropdown />, testIncidentManagementSystem());

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();
  });

  test("loading...", async () => {
    const ims = testIncidentManagementSystem();

    renderWithIMS(<EventDropdown />, ims);

    for (const event of await ims.events()) {
      expect(screen.queryByText(event.name)).not.toBeInTheDocument();
    }
  });

  test("event names", async () => {
    const ims = testIncidentManagementSystem();

    await act(async () => {
      renderWithIMS(<EventDropdown />, ims);
      await userEvent.click(screen.getByText("Event"));
    });

    for (const event of await ims.events()) {
      expect(screen.queryByText(event.name)).toBeInTheDocument();
    }
  });

  test("event links", async () => {
    const ims = testIncidentManagementSystem();

    await act(async () => {
      renderWithIMS(<EventDropdown />, ims);
      await userEvent.click(screen.getByText("Event"));
    });

    for (const event of await ims.events()) {
      const url = new URL(screen.getByText(event.name).href);
      expect(url.pathname).toEqual(URLs.event(event));
    }
  });

});
