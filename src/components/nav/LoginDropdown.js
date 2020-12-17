import moment from "moment";

import { Component } from "react";

import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import { URLs } from "../../URLs";
import { IMSContext } from "../../ims/context";


export default class LoginDropdown extends Component {

  static contextType = IMSContext;

  render = () => {
    let ims;
    if (this.context === undefined) {
      ims = undefined;
    }
    else {
      ims = this.context.ims;
    }

    let user;
    if (ims === undefined) {
      console.log("No IMS context available.");
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
        await ims.logout();
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
