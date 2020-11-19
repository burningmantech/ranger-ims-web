import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import { User } from "./auth";
import App from "./App";


describe("App component", () => {

  test("loading...", () => {
    render(<App />);

    expect(screen.queryByText("Loading...")).toBeInTheDocument();
  });

  test("load home", async () => {
    render(<App />);

    expect(await screen.findByText(/Log In/)).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  test("load home -> log in -> content", async () => {
    const username = "Cheese Butter";
    const password = username;

    render(<App />);

    expect(await screen.findByText(/Log In/)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    const title = await screen.findByText("Ranger Incident Management System")

    expect(title).toBeInTheDocument();
  });

  test("load home -> invalid log in -> no content", async () => {
    const username = "Cheese Butter";
    const password = "Not My Password";

    render(<App />);

    expect(await screen.findByText(/Log In/)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    try {
      const title = await screen.findByText("Ranger Incident Management System")
      expect(title).not.toBeInTheDocument();
    }
    catch (e) {
      expect(e.name).toEqual("TestingLibraryElementError");
    }

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

});
