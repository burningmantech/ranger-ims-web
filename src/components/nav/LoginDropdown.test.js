import moment from "moment";

import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { Authenticator, User } from "../../auth";
import { testIncidentManagementSystem } from "../../ims/TestIMS";
import { renderWithAuthenticator } from "../../contextTesting";
import LoginDropdown from "./LoginDropdown";


function testAuthenticator(username) {
  const authenticator = new Authenticator(testIncidentManagementSystem());
  if (username !== undefined) {
    authenticator.user = new User(
      username, { expiration: moment().add(1, "hour") }
    );
  }
  return authenticator;
}


describe("LoginDropdown component", () => {

  test("id", () => {
    render(<LoginDropdown />);

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();
  });

  test("no authenticator -> not logged in message", () => {
    render(<LoginDropdown />);

    expect(screen.queryByText("Not Logged In")).toBeInTheDocument();
  });

  test("no user -> not logged in message", () => {
    renderWithAuthenticator(<LoginDropdown />, testAuthenticator());

    expect(screen.queryByText("Not Logged In")).toBeInTheDocument();
  });

  test("expired user -> not logged in message", () => {
    const username = "Hubcap";
    const authenticator = testAuthenticator(username);
    authenticator.user.credentials.expiration = moment().subtract(1, "second")

    renderWithAuthenticator(<LoginDropdown />, authenticator);

    expect(screen.queryByText("Not Logged In")).toBeInTheDocument();
  });

  test("expired user -> console message", () => {
    const username = "Hubcap";
    const authenticator = testAuthenticator(username);
    const expiration = moment().subtract(1, "second");

    authenticator.user.credentials.expiration = expiration;

    console.log = jest.fn();

    renderWithAuthenticator(<LoginDropdown />, authenticator);

    expect(console.log).toHaveBeenCalledWith(
      `Previously authenticated as ${username}, ` +
      `expired ${expiration} (a few seconds ago)`
    );
  });

  test("user -> log out item", () => {
    const username = "Hubcap";

    renderWithAuthenticator(
      <LoginDropdown />, testAuthenticator(username)
    );

    expect(screen.queryByText(username)).toBeInTheDocument();
  });

  test("activate user menu -> log out item", async () => {
    const username = "Hubcap";

    renderWithAuthenticator(
      <LoginDropdown />, testAuthenticator(username)
    );

    await act(async () => {
      await userEvent.click(screen.getByText(username))
    });

    expect(screen.queryByText("Log Out")).toBeInTheDocument();
  });

  test("log out item -> log out", async () => {
    const username = "Hubcap";
    const authenticator = testAuthenticator(username);

    let notified = false;
    authenticator.delegate = () => { notified = true; }

    renderWithAuthenticator(<LoginDropdown />, authenticator);

    await act(async () => {
      await userEvent.click(screen.getByText(username))
      await userEvent.click(screen.getByText("Log Out"))
    });

    expect(notified).toBe(true);
  });

});
