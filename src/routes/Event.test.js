import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import { renderWithIMS } from "../contextTesting";
import { testIncidentManagementSystem } from "../ims/TestIMS";

import Event from "./Event";


describe("Event component", () => {

  test("no id", async () => {
    expect(() => {new Event({})}).toThrow("id is required");
  });

  test("heading", async () => {
    const eventID = "Üntz Üntz 3000";

    renderWithIMS(<Event id={eventID} />, testIncidentManagementSystem());

    expect(screen.queryByText(`Event: ${eventID}`)).toBeInTheDocument();
  });

});
