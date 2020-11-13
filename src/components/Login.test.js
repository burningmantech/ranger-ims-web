import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import React from "react";

import Login from "./Login";


describe("Login component", () => {

  test("no user -> login button", () => {
    render(<Login user={null} />);

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("user -> no login button", () => {
    render(<Login user="Cheese Butter" />);

    expect(screen.queryByText("Log In")).not.toBeInTheDocument();
  });

  test("no user -> no logged in message", () => {
    render(<Login user={null} />);

    expect(
      screen.queryByText("/You are currently logged in as /")
    ).not.toBeInTheDocument();
  });

  test("user -> logged in message", () => {
    let user = "Cheese Butter";

    render(<Login user={user} />);

    expect(
      screen.queryByText(
        "You are currently logged in as " + user, {exact: false}
      )
    ).toBeInTheDocument();
  });

  test("no user -> log in -> logged in message", async () => {
    let user = "Cheese Butter";

    class TestApp extends React.Component {

      constructor(props) {
        super(props);
        this.state = {user: null};
      }

      login = (event) => { this.setState({ user: user }); }

      render() {
        const user = this.state.user;

        return <Login user={user} login={this.login} />;
      }

    }

    render(<TestApp />);

    await userEvent.click(screen.getByText(/Log In/));

    expect(
      screen.queryByText(
        "You are currently logged in as " + user, {exact: false}
      )
    ).toBeInTheDocument();
  });

});
