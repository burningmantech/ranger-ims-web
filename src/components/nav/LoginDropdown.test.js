import moment from "moment";

import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import User from "../../ims/User";
import { renderWithIMS, testIncidentManagementSystem } from "../../ims/TestIMS";
import LoginDropdown from "./LoginDropdown";


describe("LoginDropdown component", () => {

  test("id", () => {
    render(<LoginDropdown />);

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();
  });

  test("no IMS -> not logged in message", () => {
    render(<LoginDropdown />);

    expect(screen.queryByText("Not Logged In")).toBeInTheDocument();
  });

  test("no user -> not logged in message", () => {
    renderWithIMS(<LoginDropdown />, testIncidentManagementSystem());

    expect(screen.queryByText("Not Logged In")).toBeInTheDocument();
  });

  test("expired user -> not logged in message", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    ims.user.credentials.expiration = moment().subtract(1, "second");

    renderWithIMS(<LoginDropdown />, ims);

    expect(screen.queryByText("Not Logged In")).toBeInTheDocument();
  });

  test("expired user -> console message", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);
    const expiration = moment().subtract(1, "second");

    ims.user.credentials.expiration = expiration;

    const log = console.debug;
    console.debug = jest.fn((message) => { log(message); });

    renderWithIMS(<LoginDropdown />, ims);

    expect(console.debug).toHaveBeenCalledWith(
      `Previously authenticated as ${username}, ` +
      `expired ${expiration} (a few seconds ago)`
    );
  });

  test("user -> log out item", () => {
    const username = "Hubcap";

    renderWithIMS(
      <LoginDropdown />, testIncidentManagementSystem(username)
    );

    expect(screen.queryByText(username)).toBeInTheDocument();
  });

  test("activate user menu -> log out item", async () => {
    const username = "Hubcap";

    renderWithIMS(
      <LoginDropdown />, testIncidentManagementSystem(username)
    );

    await act(async () => {
      await userEvent.click(screen.getByText(username))
    });

    expect(screen.queryByText("Log Out")).toBeInTheDocument();
  });

  test("log out item -> log out", async () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    let notified = false;
    ims.delegate = () => { notified = true; }

    renderWithIMS(<LoginDropdown />, ims);

    await act(async () => {
      await userEvent.click(screen.getByText(username))
      await userEvent.click(screen.getByText("Log Out"))
    });

    expect(notified).toBe(true);
  });

});
