import moment from "moment";

import { Component } from "react";

import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import { AuthenticatorContext } from "../../auth";


export default class LoginDropdown extends Component {

  static contextType = AuthenticatorContext;

  render() {
    let user;
    const authenticator = this.context;
    if (authenticator === undefined) {
      console.log("No authenticator context available.");
      user = null;
    }
    else {
      user = authenticator.loggedInUser();
    }

    if (user === null) {
      if (authenticator !== undefined && authenticator.user !== null) {
        const elapsed = moment.duration(
          moment() - authenticator.expiration
        ).humanize();
        console.log(
          `Previously authenticated as ${authenticator.user.username}, ` +
          `expired ${authenticator.expiration} (${elapsed} ago)`
        );
      }
      return (
        <Nav.Item id="nav_user_dropdown">Not Logged In</Nav.Item>
      );
    }
    else {
      return (
        <NavDropdown title={user.username} id="nav_user_dropdown">
          <NavDropdown.Item href="#logout">Log Out</NavDropdown.Item>
        </NavDropdown>
      );
    }
  }

}
