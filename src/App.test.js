import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory, Location } from "history";

import App from "./App";

test("loading", () => {
  render(<App />);

  expect(screen.queryByText("Loading...")).toBeInTheDocument();
});

test("loaded home", () => {
  render(<App />);

  expect(
    screen.queryByText("Ranger Incident Management System")
  ).toBeInTheDocument();
});
