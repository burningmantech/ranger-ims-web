import { DateTime } from "luxon";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../../ims/TestIMS";
import LoginDropdown from "./LoginDropdown";

describe("LoginDropdown component", () => {
  test("id", () => {
    console.error = jest.fn((e) => {
      console.info(e);
    });

    render(<LoginDropdown />);

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();
  });

  test("no IMS -> not logged in message", () => {
    console.error = jest.fn((e) => {
      console.info(e);
    });

    render(<LoginDropdown />);

    expect(screen.getByText("Not Logged In")).toBeInTheDocument();
  });

  test("no user -> not logged in message", () => {
    renderWithIMSContext(<LoginDropdown />, testIncidentManagementSystem());

    expect(screen.getByText("Not Logged In")).toBeInTheDocument();
  });

  test("expired user -> not logged in message", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    ims.user.credentials.expiration = DateTime.local().minus({ seconds: 1 });

    renderWithIMSContext(<LoginDropdown />, ims);

    expect(screen.getByText("Not Logged In")).toBeInTheDocument();
  });

  test("expired user -> console message", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);
    const expiration = DateTime.local().minus({ seconds: 1 });

    ims.user.credentials.expiration = expiration;

    const spy = jest.spyOn(console, "debug");

    renderWithIMSContext(<LoginDropdown />, ims);

    expect(spy).toHaveBeenCalledWith(
      `Previously authenticated as ${username}, ` +
        `expired ${expiration} (${expiration.toRelative()})`,
    );
  });

  test("user -> log out item", () => {
    const username = "Hubcap";

    renderWithIMSContext(
      <LoginDropdown />,
      testIncidentManagementSystem(username),
    );

    expect(screen.getByText(username)).toBeInTheDocument();
  });

  test("activate user menu -> log out item", async () => {
    const username = "Hubcap";

    renderWithIMSContext(
      <LoginDropdown />,
      testIncidentManagementSystem(username),
    );

    await userEvent.click(screen.getByText(username));

    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  test("log out item -> log out", async () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    let notified = false;
    ims.delegate = () => {
      notified = true;
    };

    renderWithIMSContext(<LoginDropdown />, ims);

    await userEvent.click(screen.getByText(username));
    await userEvent.click(screen.getByText("Log Out"));

    expect(notified).toBe(true);
  });
});
