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

  test("loading events", async () => {
    const ims = testIncidentManagementSystem();

    renderWithIMS(<EventDropdown />, ims);

    for (const event of await ims.events()) {
      expect(screen.queryByText(event.name)).not.toBeInTheDocument();
    }
  });

  test("events fail to load", async () => {
    const ims = testIncidentManagementSystem();

    ims.events = jest.fn(
      () => { throw new Error("Can't load events because reasons..."); }
    );

    const spy = jest.spyOn(console, "error");

    await act(async () => {
      renderWithIMS(<EventDropdown />, ims);
      await userEvent.click(screen.getByText("Event"));
    });

    expect(screen.queryByText("Error loading events")).toBeInTheDocument();

    expect(spy).toHaveBeenCalledWith(
      "Unable to load EventDropdown: Can't load events because reasons..."
    );
  });

  test("no events loaded", async () => {
    const ims = testIncidentManagementSystem();

    ims.testData.events = [];

    await act(async () => {
      renderWithIMS(<EventDropdown />, ims);
      await userEvent.click(screen.getByText("Event"));
    });

    expect(screen.queryByText("No events found")).toBeInTheDocument();
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

  test("events load after unmount", async () => {
    const ims = testIncidentManagementSystem();

    let done;
    const promise = new Promise((resolve, reject) => { done = resolve; });

    class TestEventDropdown extends EventDropdown {
      fetch = () => {
        console.info("Starting fetch...");
        return promise.then(() => {
          console.info("...done fetching");
          this._setEvents([]);
        });
      }
    }

    const container = renderWithIMS((<TestEventDropdown />), ims);

    container.unmount();

    const spy = jest.spyOn(console, "debug");

    done();
    await promise;

    expect(spy).toHaveBeenCalledWith(
      "Received events after TestEventDropdown unmounted."
    );
  });

});
