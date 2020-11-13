import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Home from "./Home";

test("loading", () => {
  render(<Home />);

  expect(screen.queryByText("Loading...")).toBeInTheDocument();
});

test("loaded login", () => {
  render(<Home />);

  expect(screen.queryByText("Log In")).toBeInTheDocument();
});
