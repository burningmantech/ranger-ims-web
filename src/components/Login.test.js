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
    const username = "Cheese Butter";
    const content = "Hello, World!"

    render(<Login user={new User(username)}>{content}</Login>);

    expect(screen.queryByText(content)).toBeInTheDocument();
  });

  test("no user -> log in -> logged in message", async () => {
    const username = "Cheese Butter";
    const content = "Hello, World!"

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
        return (
          <Login user={this.state.user} login={this.login}>{content}</Login>
        );
      }

    }

    render(<TestApp />);

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.click(screen.getByText(/Log In/));

    expect(screen.queryByText(content)).toBeInTheDocument();
  });

});
