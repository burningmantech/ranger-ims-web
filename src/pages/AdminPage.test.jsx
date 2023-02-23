import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";

import AdminPage from "./AdminPage";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";
import { waitForNavEvents } from "../test/wait";

describe("AdminPage component", () => {
  test("heading", async () => {
    renderWithIMSContext(<AdminPage />, testIncidentManagementSystem());
    await waitForNavEvents();

    expect(await screen.findByText("Admin Console")).toBeInTheDocument();
  });
});
