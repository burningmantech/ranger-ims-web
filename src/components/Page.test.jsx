import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";

import Page from "./Page";

export const waitForEffects = async () => {
  // Let effects complete
  await userEvent.click(screen.getByText("Event"));
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading events…")
  );
};

describe("Page component", () => {
  test("id", async () => {
    renderWithIMSContext(<Page />, testIncidentManagementSystem());
    expect(document.getElementById("page")).toBeInTheDocument();

    await waitForEffects();
  });

  test("includes navigation", async () => {
    renderWithIMSContext(<Page />, testIncidentManagementSystem());
    expect(document.getElementById("page_navigation")).toBeInTheDocument();

    await waitForEffects();
  });

  test("includes children", async () => {
    const content = "Hello!";

    renderWithIMSContext(
      <Page>{content}</Page>,
      testIncidentManagementSystem()
    );
    expect(screen.getByText(content)).toBeInTheDocument();

    await waitForEffects();
  });
});
