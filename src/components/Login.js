/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }]*/

import invariant from "invariant";
import { useContext, useReducer, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalDialog from "react-bootstrap/ModalDialog";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";

import { IMSContext } from "../ims/context";


const Login = (props) => {

  const imsContext = useContext(IMSContext);
  invariant(imsContext != null, "IMS context is required");
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const [_ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const onUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  if (ims.isLoggedIn()) {
    return <>{props.children}</>;
  }
  else {
    async function onLogin(event) {
      event.preventDefault();
      try {
        await ims.login(username, {password: password});
      }
      catch (e) {
        const errorMessage = e.message;
        console.error(`Login failed: ${errorMessage}`);
        setErrorMessage(errorMessage);
        return;
      }

      forceUpdate();
    }

    let Error;
    if (errorMessage === null) {
      Error = "";
    }
    else {
      Error = (
        <Alert variant="danger">
          <Alert.Heading>Login Failed</Alert.Heading>
          <code>{errorMessage}</code>
        </Alert>
      );
    }

    return (
      <Container>
        <Form onSubmit={onLogin}>
          <ModalDialog>

            <ModalHeader>
              <ModalTitle>Authorization Required</ModalTitle>
            </ModalHeader>

            <ModalBody>

              {Error}

              <Form.Group controlId="username_field">
                <Form.Label>Ranger Handle or Email</Form.Label>
                <Form.Control
                  autoComplete="username email"
                  inputMode="latin-name"
                  minLength="1"
                  onChange={onUsernameChange}
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
                  onChange={onPasswordChange}
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

export default Login;
