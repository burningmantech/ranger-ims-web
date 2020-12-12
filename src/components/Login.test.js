import moment from "moment";

import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { Authenticator, User } from "../auth";
import { testIncidentManagementSystem } from "../ims/TestIMS";
import { renderWithAuthenticator } from "../contextTesting";
import Login from "./Login";


const testAuthenticator = (username) => {
  const source = testIncidentManagementSystem();
  if (username !== undefined) {
    source.user = new User(
      username, { expiration: moment().add(1, "hour") }
    );
  }

  return new Authenticator(source);
}


describe("Login component", () => {

  afterEach(() => {
    Authenticator.eraseStorage();
  });

  test("no user -> login button", () => {
    renderWithAuthenticator(<Login />, testAuthenticator());

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("expired user -> login button", () => {
    const username = "Hubcap";
    const authenticator = testAuthenticator(username);
    authenticator.source.user.credentials.expiration = (
      moment().subtract(1, "second")
    );

    renderWithAuthenticator(<Login />, authenticator);

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("user -> no login button", () => {
    const username = "Hubcap";
    const authenticator = testAuthenticator(username);

    renderWithAuthenticator(<Login />, authenticator);

    expect(screen.queryByText("Log In")).not.toBeInTheDocument();
  });

  test("user -> logged in message", () => {
    const username = "Hubcap";
    const authenticator = testAuthenticator(username);
    const content = "Hello, World!";

    renderWithAuthenticator(<Login>{content}</Login>, authenticator);

    expect(screen.queryByText(content)).toBeInTheDocument();
  });

  test("no user -> log in -> logged in message", async () => {
    const authenticator = testAuthenticator();
    const content = "Hello, World!"
    const username = "Hubcap";
    const password = username;

    renderWithAuthenticator(<Login>{content}</Login>, authenticator);

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    const message = await screen.findByText(content);

    expect(message).toBeInTheDocument();
  });

  test("no user -> invalid log in -> no logged in message", async () => {
    const authenticator = testAuthenticator();
    const content = "Hello, World!"
    const username = "Hubcap";
    const password = "Not My Password";

    renderWithAuthenticator(<Login>{content}</Login>, authenticator);

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    try {
      const message = await screen.findByText(content);
      expect(message).not.toBeInTheDocument();
    }
    catch(e) {
      expect(e.name).toEqual("TestingLibraryElementError");
    }

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

});
