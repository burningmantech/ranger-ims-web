import { URLs } from "../../URLs";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../../ims/TestIMS";
import { waitForNavEvents } from "../../test/wait";

import NavigationBar from "./NavigationBar";

describe("Navbar component", () => {
  test("id", async () => {
    const navID = "who-what";

    renderWithIMSContext(
      <NavigationBar id={navID} />,
      testIncidentManagementSystem(),
    );

    expect(document.getElementById(navID)).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("includes logo", async () => {
    const navID = "nav_home_image";

    renderWithIMSContext(
      <NavigationBar id={navID} />,
      testIncidentManagementSystem(),
    );

    expect(document.getElementById(navID)).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("includes link to home", async () => {
    renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());

    const link = document.getElementById("nav_home_link");

    expect(link).toBeInTheDocument();
    expect(link.href).toEqual(`http://localhost${URLs.ims}`);

    await waitForNavEvents();
  });

  test("includes events dropdown", async () => {
    renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("includes user dropdown", async () => {
    renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();

    await waitForNavEvents();
  });
});
