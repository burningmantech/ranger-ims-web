import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import { User } from "./auth";
import App from "./App";


describe("App component", () => {

  test("loading", () => {
    render(<App />);

    expect(screen.queryByText("Loading...")).toBeInTheDocument();
  });

  test("loaded home", async () => {
    render(<App />);

    expect(await screen.findByText(/Log In/)).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  test("loaded home -> log in", async () => {
    const username = "Cheese Butter";

    render(<App />);

    expect(await screen.findByText(/Log In/)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.click(screen.getByText(/Log In/));

    const title = await screen.findByText("Ranger Incident Management System")

    expect(title).toBeInTheDocument();
  });

});
