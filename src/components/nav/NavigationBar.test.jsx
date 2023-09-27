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

  test("not logged in, doesn't include events dropdown", async () => {
    renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());

    expect(
      document.getElementById("nav_events_dropdown"),
    ).not.toBeInTheDocument();

    await waitForNavEvents();
  });

  test("logged in, includes events dropdown", async () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    renderWithIMSContext(<NavigationBar />, ims);

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("not logged in, doesn't include user dropdown", async () => {
    renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());

    expect(
      document.getElementById("nav_user_dropdown"),
    ).not.toBeInTheDocument();

    await waitForNavEvents();
  });

  test("logged in, includes user dropdown", async () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    renderWithIMSContext(<NavigationBar />, ims);

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();

    await waitForNavEvents();
  });
});
