import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { URLs } from "../../URLs";

import EventDropdown from "./EventDropdown";
import LoginDropdown from "./LoginDropdown";

import logo from "../../logo.svg";


const NavigationBar = (props) => {
  return (
    <Navbar id={props.id}>
      <Navbar.Brand href={URLs.ims} id="nav_home_link">
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

export default NavigationBar;
