import moment from "moment";

import { Component } from "react";

import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import { AuthenticatorContext } from "../../context";
import { URLs } from "../../URLs";


export default class LoginDropdown extends Component {

  static contextType = AuthenticatorContext;

  render = () => {
    let authenticator;
    if (this.context === undefined) {
      authenticator = undefined;
    }
    else {
      authenticator = this.context.authenticator;
    }

    let user;
    if (authenticator === undefined) {
      console.log("No authenticator context available.");
      user = null;
    }
    else {
      user = authenticator.loggedInUser();
    }

    if (user === null) {
      if (authenticator !== undefined && authenticator.source.user !== null) {
        const oldUser = authenticator.source.user;
        const expiration = oldUser.credentials.expiration;
        const elapsed = moment.duration(moment() - expiration).humanize();
        console.log(
          `Previously authenticated as ${oldUser}, ` +
          `expired ${expiration} (${elapsed} ago)`
        );
      }
      return (
        <Nav.Item id="nav_user_dropdown">Not Logged In</Nav.Item>
      );
    }
    else {
      async function onLogout(eventKey, event) {
        await authenticator.logout();
      }
      return (
        <NavDropdown title={user.username} id="nav_user_dropdown">
          <NavDropdown.Item href={URLs.admin}>Admin</NavDropdown.Item>
          <NavDropdown.Item onSelect={onLogout}>Log Out</NavDropdown.Item>
        </NavDropdown>
      );
    }
  }

}
