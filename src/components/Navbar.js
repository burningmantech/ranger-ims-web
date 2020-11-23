import { Component } from "react";

import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";

import { URL } from "../URL";
import logo from "../logo.svg";


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

        -Event-
        -User-
      </Navbar>
    );
  }

}
