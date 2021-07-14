import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";

import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";

import Event from "./Event";


describe("Event component", () => {

  test("loading...", async () => {
    const ims = testIncidentManagementSystem();

    renderWithIMS(<Event id="1" />, ims);

    expect(screen.queryByText(`Loading...`)).toBeInTheDocument();
  });

  test("event fails to load", async () => {
    const ims = testIncidentManagementSystem();

    ims.eventWithID = jest.fn(
      () => { throw new Error("Can't load event because reasons..."); }
    );

    const spy = jest.spyOn(console, "error");

    renderWithIMS(<Event id="1a" />, ims);

    screen.debug();

    expect(screen.queryByText("Error loading event")).toBeInTheDocument();

    expect(spy).toHaveBeenCalledWith(
      "Unable to load Event: Can't load event because reasons..."
    );
  });

  test("heading", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      await act(async () => {
        renderWithIMS(<Event id={event.id} />, ims);

        screen.debug();
      });

      expect(screen.queryByText(`Event: ${event.name}`)).toBeInTheDocument();
    }
  });

});
