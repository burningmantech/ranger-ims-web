import "@testing-library/jest-dom/extend-expect";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AdminPage from "./AdminPage";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";

export const waitForEffects = async () => {
  // Let effects complete
  await userEvent.click(screen.getByText("Event"));
  await waitForElementToBeRemoved(() => screen.queryByText("Loading events…"));
};

describe("AdminPage component", () => {
  test("heading", async () => {
    renderWithIMSContext(<AdminPage />, testIncidentManagementSystem());
    await waitForEffects();

    expect(await screen.findByText("Admin Console")).toBeInTheDocument();
  });
});
