import moment from "moment";

import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { URL } from "../../URL";

import { Authenticator, TestAuthentationSource, User } from "../../auth";
import { AuthenticatorContext } from "../../context";
import LoginDropdown from "./LoginDropdown";


function renderWithAuthenticator (ui, authenticator, ...renderOptions) {
  return render(
    (
      <AuthenticatorContext.Provider value={{authenticator: authenticator}}>
        {ui}
      </AuthenticatorContext.Provider>
    ),
    renderOptions
  );
}


function testAuthenticator(user) {
  const authenticator = new Authenticator(new TestAuthentationSource());
  if (user !== undefined) {
    authenticator.user = user;
    authenticator.expiration = moment().add(1, "hour")
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

  test("user -> log out item", () => {
    const username = "Cheese Butter";

    renderWithAuthenticator(
      <LoginDropdown />, testAuthenticator(new User(username))
    );

    expect(screen.queryByText(username)).toBeInTheDocument();
  });

  test("activate user menu -> log out item", async () => {
    const username = "Cheese Butter";

    renderWithAuthenticator(
      <LoginDropdown />, testAuthenticator(new User(username))
    );

    await act(async () => {
      await userEvent.click(screen.getByText(username))
    });

    expect(screen.queryByText("Log Out")).toBeInTheDocument();
  });

  test("log out item -> log out", async () => {
    const username = "Cheese Butter";
    const authenticator = testAuthenticator(new User(username));

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
