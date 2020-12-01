import { Component } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalDialog from "react-bootstrap/ModalDialog";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";

import { AuthenticatorContext } from "../context";


export default class Login extends Component {

  static contextType = AuthenticatorContext;

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      failed: false,
      succeeded: false,
    };
  }

  onUsernameChange = (event) => {
    this.setState({username: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  render = () => {
    const component = this;
    const authenticator = this.context.authenticator;

    const username = this.state.username;
    const password = this.state.password;

    if (authenticator.isLoggedIn()) {
      return <>{this.props.children}</>;
    }
    else {
      async function onLogin(event) {
        event.preventDefault();
        const result = await authenticator.login(
          username, {password: password}
        );
        if (result) {
          component.setState({succeeded: true});  // To cause a re-render.
        }
        else {
          component.setState({failed: true});
        }
      }

      return (
        <Container>
          <Form onSubmit={onLogin}>
            <ModalDialog>

              <ModalHeader>
                <ModalTitle>Authorization Required</ModalTitle>
              </ModalHeader>

              <ModalBody>

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
                    value={username}
                  />
                  <Form.Text muted>
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
                    value={password}
                  />
                </Form.Group>

              </ModalBody>

              <ModalFooter>
                <Button variant="primary" type="submit">Log In</Button>
              </ModalFooter>

            </ModalDialog>
          </Form>
        </Container>
      );
    }
  }

}
