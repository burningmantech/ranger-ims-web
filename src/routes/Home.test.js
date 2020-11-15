import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import User from "../auth";
import Home from "./Home";


describe("Home component", () => {

  test("loading", () => {
    render(<Home user={null} />);

    expect(screen.queryByText("Loading...")).toBeInTheDocument();
  });

  test("loaded, no user", async () => {
    render(<Home user={null} />);

    expect(await screen.findByText(/Log In/)).toBeInTheDocument();
  });

  test("loaded, user", async () => {
    const username = "Cheese Butter";

    render(<Home user={new User(username)} />);

    expect(await screen.findByText(/Logged in stuff here/)).toBeInTheDocument();
  });
});
