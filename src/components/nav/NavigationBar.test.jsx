import "@testing-library/jest-dom/extend-expect";
import { act } from "@testing-library/react";

import { URLs } from "../../URLs";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../../ims/TestIMS";

import { waitForEffects as waitForEventDropdownEffects } from "./EventDropDown.test";
import NavigationBar from "./NavigationBar";

export const waitForEffects = async () => {
  await waitForEventDropdownEffects();
};

describe("Navbar component", () => {
  test("id", async () => {
    const navID = "who-what";

    await act(async () => {
      renderWithIMSContext(
        <NavigationBar id={navID} />,
        testIncidentManagementSystem()
      );
    });

    expect(document.getElementById(navID)).toBeInTheDocument();

    await waitForEffects();
  });

  test("includes logo", async () => {
    const navID = "nav_home_image";

    await act(async () => {
      renderWithIMSContext(
        <NavigationBar id={navID} />,
        testIncidentManagementSystem()
      );
    });

    expect(document.getElementById(navID)).toBeInTheDocument();

    await waitForEffects();
  });

  test("includes link to home", async () => {
    await act(async () => {
      renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());
    });

    const link = document.getElementById("nav_home_link");

    expect(link).toBeInTheDocument();
    expect(link.href).toEqual(`http://localhost${URLs.ims}`);

    await waitForEffects();
  });

  test("includes events dropdown", async () => {
    await act(async () => {
      renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());
    });

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();

    await waitForEffects();
  });

  test("includes user dropdown", async () => {
    await act(async () => {
      renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());
    });

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();

    await waitForEffects();
  });
});
