import { Component } from "react";

import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { URL } from "../../URL";

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

          <Nav className="mr-auto">
            <NavDropdown title="Event" id="nav_events_dropdown">
              <NavDropdown.Item href="#events/2020">2020</NavDropdown.Item>
              <NavDropdown.Item href="#events/2019">2019</NavDropdown.Item>
              <NavDropdown.Item href="#events/2018">2018</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav>
            <NavDropdown title="Bucket" id="nav_user_dropdown">
              <NavDropdown.Item href="#logout">Log Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>
      </Navbar>
    );
  }

}
