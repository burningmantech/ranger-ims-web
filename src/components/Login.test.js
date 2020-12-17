import moment from "moment";

import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { Authenticator, User } from "../auth";
import { testIncidentManagementSystem } from "../ims/TestIMS";
import { renderWithIMS } from "../contextTesting";
import Login from "./Login";


describe("Login component", () => {

  afterEach(() => {
    Authenticator.eraseStorage();
  });

  test("no user -> login button", () => {
    renderWithIMS(<Login />, testIncidentManagementSystem());

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("expired user -> login button", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);
    ims.user.credentials.expiration = moment().subtract(1, "second");

    renderWithIMS(<Login />, ims);

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("user -> no login button", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    renderWithIMS(<Login />, ims);

    expect(screen.queryByText("Log In")).not.toBeInTheDocument();
  });

  test("user -> logged in message", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);
    const content = "Hello, World!";

    renderWithIMS(<Login>{content}</Login>, ims);

    expect(screen.queryByText(content)).toBeInTheDocument();
  });

  test("no user -> log in -> logged in message", async () => {
    const ims = testIncidentManagementSystem();
    const content = "Hello, World!"
    const username = "Hubcap";
    const password = username;

    renderWithIMS(<Login>{content}</Login>, ims);

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    const message = await screen.findByText(content);

    expect(message).toBeInTheDocument();
  });

  test("no user -> invalid log in -> no logged in message", async () => {
    const ims = testIncidentManagementSystem();
    const content = "Hello, World!"
    const username = "Hubcap";
    const password = "Not My Password";

    renderWithIMS(<Login>{content}</Login>, ims);

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
