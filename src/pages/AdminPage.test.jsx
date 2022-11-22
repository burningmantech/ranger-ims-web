import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AdminPage from "./AdminPage";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";
import { waitForNavBar } from "../test/wait";

describe("AdminPage component", () => {
  test("heading", async () => {
    renderWithIMSContext(<AdminPage />, testIncidentManagementSystem());
    await waitForNavBar();

    expect(await screen.findByText("Admin Console")).toBeInTheDocument();
  });
});
