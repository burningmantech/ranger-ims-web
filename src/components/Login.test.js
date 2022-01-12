import { DateTime } from "luxon";

import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import User from "../ims/User";
import { renderWithIMSContext, testIncidentManagementSystem } from "../ims/TestIMS";
import Login from "./Login";


describe("Login component", () => {

  afterEach(() => {
    testIncidentManagementSystem().logout();
  });

  test("no user -> login button", () => {
    renderWithIMSContext(<Login />, testIncidentManagementSystem());

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("expired user -> login button", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);
    ims.user.credentials.expiration = DateTime.local().minus({ seconds: 1 });

    renderWithIMSContext(<Login />, ims);

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("user -> no login button", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    renderWithIMSContext(<Login />, ims);

    expect(screen.queryByText("Log In")).not.toBeInTheDocument();
  });

  test("user -> content", () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);
    const content = "Hello, World!";

    renderWithIMSContext(<Login>{content}</Login>, ims);

    expect(screen.queryByText(content)).toBeInTheDocument();
  });

  test("no user -> log in -> content", async () => {
    const ims = testIncidentManagementSystem();
    const content = "Hello, World!"
    const username = "Hubcap";
    const password = username;

    renderWithIMSContext(<Login>{content}</Login>, ims);

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    expect(await screen.findByText(content)).toBeInTheDocument();
  });

  test("no user -> invalid log in -> no content", async () => {
    const ims = testIncidentManagementSystem();
    const content = "Hello, World!"
    const username = "Hubcap";
    const password = "Not My Password";

    renderWithIMSContext(<Login>{content}</Login>, ims);

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    try {
      const element = await screen.findByText(content);
      expect(element).not.toBeInTheDocument();
    }
    catch(e) {
      expect(e.name).toEqual("TestingLibraryElementError");
    }

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("no user -> log in exception -> error message", async () => {
    const message = "Whoops! Something went wrong...";
    const ims = testIncidentManagementSystem();
    const content = "Hello, World!"
    const username = "Hubcap";
    const password = username;

    ims.login = jest.fn(async () => { throw new Error(message); });

    await act(async () => {
      renderWithIMSContext(<Login>{content}</Login>, ims);

      await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
      await userEvent.type(screen.getByLabelText(/Password/), password);
      await userEvent.click(screen.getByText(/Log In/));
    });

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

});
