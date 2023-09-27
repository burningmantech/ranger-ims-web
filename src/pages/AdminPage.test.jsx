import { screen } from "@testing-library/react";

import { waitForURLBag } from "../components/BagTable.test";

import AdminPage from "./AdminPage";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";
import { waitForNavEvents } from "../test/wait";

describe("AdminPage component", () => {
  test("heading", async () => {
    renderWithIMSContext(<AdminPage />, testIncidentManagementSystem());
    await waitForURLBag();
    await waitForNavEvents();

    expect(await screen.findByText("Admin Console")).toBeInTheDocument();
  });
});
