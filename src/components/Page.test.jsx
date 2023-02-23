import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";

import { waitForNavEvents } from "../test/wait";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";

import Page from "./Page";

describe("Page component", () => {
  test("id", async () => {
    renderWithIMSContext(<Page />, testIncidentManagementSystem());
    expect(document.getElementById("page")).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("includes navigation", async () => {
    renderWithIMSContext(<Page />, testIncidentManagementSystem());
    expect(document.getElementById("page_navigation")).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("includes children", async () => {
    const content = "Hello!";

    renderWithIMSContext(
      <Page>{content}</Page>,
      testIncidentManagementSystem(),
    );
    expect(screen.getByText(content)).toBeInTheDocument();

    await waitForNavEvents();
  });
});
