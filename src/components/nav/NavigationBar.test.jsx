import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { URLs } from "../../URLs";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../../ims/TestIMS";

import NavigationBar from "./NavigationBar";

export const waitForEffects = async () => {
  // Let effects complete
  await userEvent.click(screen.getByText("Event"));
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading events…"),
  );
};

describe("Navbar component", () => {
  test("id", async () => {
    const navID = "who-what";

    renderWithIMSContext(
      <NavigationBar id={navID} />,
      testIncidentManagementSystem(),
    );

    expect(document.getElementById(navID)).toBeInTheDocument();

    await waitForEffects();
  });

  test("includes logo", async () => {
    const navID = "nav_home_image";

    renderWithIMSContext(
      <NavigationBar id={navID} />,
      testIncidentManagementSystem(),
    );

    expect(document.getElementById(navID)).toBeInTheDocument();

    await waitForEffects();
  });

  test("includes link to home", async () => {
    renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());

    const link = document.getElementById("nav_home_link");

    expect(link).toBeInTheDocument();
    expect(link.href).toEqual(`http://localhost${URLs.ims}`);

    await waitForEffects();
  });

  test("includes events dropdown", async () => {
    renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();

    await waitForEffects();
  });

  test("includes user dropdown", async () => {
    renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();

    await waitForEffects();
  });
});
