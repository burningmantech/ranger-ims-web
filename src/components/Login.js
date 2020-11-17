import React from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
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
        <Container>
          <ModalDialog>

            <ModalHeader>
              <ModalTitle>Authorization Required</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <Form>

                <Form.Group controlId="username_field">
                  <Form.Label>Ranger Handle or Email</Form.Label>
                  <Form.Control
                    autoComplete="username email"
                    inputMode="latin-name"
                    minLength="1"
                    onChange={this.onUsernameChange}
                    placeholder="Bucket"
                    required={true}
                    type="text"
                    value={this.state.username}
                  />
                  <Form.Text className="text-muted">
                    Must match your Ranger Secret Clubhouse profile.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="password_field">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    autoComplete="current-password"
                    inputMode="latin-prose"
                    onChange={this.onPasswordChange}
                    placeholder="…password…"
                    type="password"
                    value={this.state.password}
                  />
                </Form.Group>

              </Form>
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
