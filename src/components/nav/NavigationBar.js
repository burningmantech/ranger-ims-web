import { Component } from "react";

import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { URL } from "../../URL";

import EventDropdown from "./EventDropdown";
import LoginDropdown from "./LoginDropdown";

import logo from "../../logo.svg";


export default class NavigationBar extends Component {

  render() {
    return (
      <Navbar id={this.props.id}>
        <Navbar.Brand href={URL.home} id="nav_home_link">
          <Image id="nav_home_image"
            width="50"
            height="33"
            alt="Ranger IMS"
            src={logo}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive_navbar_nav" />
        <Navbar.Collapse id="responsive_navbar_nav">
          <Nav className="mr-auto"><EventDropdown /></Nav>
          <Nav><LoginDropdown /></Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}
