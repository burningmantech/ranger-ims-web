import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Login from "./Login";

test("no user -> login button", () => {
  let user = null;

  render(<Login user={user} />);

  expect(screen.queryByText("Log In")).toBeInTheDocument();
});

test("user -> no login button", () => {
  render(<Login user="Cheese Butter" />);

  expect(screen.queryByText("Log In")).not.toBeInTheDocument();
});

test("no user -> no logged in message", () => {
  let user = null;

  render(<Login user={user} />);

  expect(
    screen.queryByText(
      "You are currently logged in as",
      { exact: false }
    ),
  ).not.toBeInTheDocument();
});

test("user -> logged in message", () => {
  let user = "Cheese Butter";

  render(<Login user={user} />);

  expect(
    screen.queryByText(
      "You are currently logged in as",
      { exact: false }
    ),
  ).toBeInTheDocument();
});

test("user -> named", () => {
  let user = "Cheese Butter";

  render(<Login user={user} />);

  expect(screen.queryByText(user)).toBeInTheDocument();
});
