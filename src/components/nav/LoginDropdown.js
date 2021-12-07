import { useContext } from "react";

import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import { URLs } from "../../URLs";
import { IMSContext } from "../../ims/context";


const LoginDropdown = (props) => {
  const imsContext = useContext(IMSContext);
  const ims = (imsContext === undefined) ? undefined : imsContext.ims;

  let user;
  if (ims === undefined) {
    console.error("No IMS context available.");
    user = null;
  }
  else {
    if (ims.isLoggedIn()) {
      user = ims.user;
    }
    else {
      user = null;
    }
  }

  if (user === null) {
    if (ims !== undefined && ims.user !== null) {
      const oldUser = ims.user;
      const expiration = oldUser.credentials.expiration;
      console.debug(
        `Previously authenticated as ${oldUser}, ` +
        `expired ${expiration} (${expiration.toRelative()})`
      );
    }
    return (
      <Nav.Item id="nav_user_dropdown">Not Logged In</Nav.Item>
    );
  }
  else {
    async function onLogout(eventKey, event) {
      console.error("LOG OUT");
      await ims.logout();
    }
    return (
      <NavDropdown title={user.username} id="nav_user_dropdown">
        <NavDropdown.Item href={URLs.admin}>Admin</NavDropdown.Item>
        <NavDropdown.Item onClick={onLogout}>Log Out</NavDropdown.Item>
      </NavDropdown>
    );
  }
}

export default LoginDropdown;
