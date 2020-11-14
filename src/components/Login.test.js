import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import React from "react";

import User from "../auth";
import Login from "./Login";

describe("Login component", () => {

  test("no user -> login button", () => {
    render(<Login user={null} />);

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("user -> no login button", () => {
    render(<Login user={new User("Cheese Butter")} />);

    expect(screen.queryByText("Log In")).not.toBeInTheDocument();
  });

  test("no user -> no logged in message", () => {
    render(<Login user={null} />);

    expect(
      screen.queryByText("/You are currently logged in as /")
    ).not.toBeInTheDocument();
  });

  test("user -> logged in message", () => {
    let username = "Cheese Butter";

    render(<Login user={new User(username)} />);

    expect(
      screen.queryByText(
        "You are currently logged in as " + username, {exact: false}
      )
    ).toBeInTheDocument();
  });

  test("no user -> log in -> logged in message", async () => {
    let username = "Cheese Butter";

    class TestApp extends React.Component {

      constructor(props) {
        super(props);
        this.state = {user: null};
      }

      login = async (username, password) => {
        const user = new User(username);
        this.setState({user: user});
      }

      render() {
        return <Login user={this.state.user} login={this.login} />;
      }

    }

    render(<TestApp />);

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.click(screen.getByText(/Log In/));

    expect(
      screen.queryByText(
        "You are currently logged in as " + username, {exact: false}
      )
    ).toBeInTheDocument();
  });

});
