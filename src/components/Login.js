import React from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ModalBody from "react-bootstrap/ModalBody"
import ModalDialog from "react-bootstrap/ModalDialog"
import ModalFooter from "react-bootstrap/ModalFooter"
import ModalHeader from "react-bootstrap/ModalHeader"
import ModalTitle from "react-bootstrap/ModalTitle"

export default class Login extends React.Component {

  constructor(props) {
    if (props.user === undefined) {
      throw new Error("user is not defined");
    }

    super(props);

    this.state = {
      username: (props.user === null) ? "" : props.user,
      password: "",
    };
  }

  onUsernameChange = (event) => {
    this.setState({username: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  onLogin = async (event) => {
    event.preventDefault();

    if (this.props.login === undefined) {
      console.log("No login function defined.");
    }
    else {
      await this.props.login(this.state.username, this.state.password);
    }
  }

  render() {
    const user = this.props.user;

    if (user === null) {
      return (
        <Container fluid={true}>
          <ModalDialog>

            <ModalHeader>
              <ModalTitle>Authorization Required</ModalTitle>
            </ModalHeader>

            <ModalBody>

                <p>Please provide your Ranger Secret Clubhouse credentials.</p>

                <div className="login_field">
                  <label htmlFor="username_field">Ranger Handle or Email:</label>
                  <input
                    id="username_field"
                    type="text"
                    value={this.state.username}
                    inputMode="latin-name"
                    placeholder="Bucket"
                    autoComplete="username email"
                    minLength="1"
                    required={true}
                    onChange={this.onUsernameChange}
                  />
                </div>

                <div className="login_field">
                  <label htmlFor="password_field">Password:</label>
                  <input
                    id="password_field"
                    type="password"
                    inputMode="latin-prose"
                    placeholder="password"
                    autoComplete="current-password"
                    onChange={this.onPasswordChange}
                  />
                </div>

            </ModalBody>

            <ModalFooter>
              <Button variant="primary" onClick={this.onLogin}>Log In</Button>
            </ModalFooter>

          </ModalDialog>
        </Container>
      );
    }
    else {
      return <>{this.props.children}</>;
    }
  }

}
