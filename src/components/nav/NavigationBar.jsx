import invariant from "invariant";
import { useContext } from "react";

import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { URLs } from "../../URLs";

import EventDropdown from "./EventDropdown";
import LoginDropdown from "./LoginDropdown";

import { IMSContext } from "../../ims/context";
import logo from "../../logo.svg";

const NavigationBar = ({ id }) => {
  const imsContext = useContext(IMSContext);
  invariant(imsContext != null, "IMS context is required");
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  const controls = ims.isLoggedIn() ? (
    <>
      <Navbar.Toggle aria-controls="responsive_navbar_nav" />
      <Navbar.Collapse id="responsive_navbar_nav">
        <Nav className="mr-auto">
          <EventDropdown />
        </Nav>
        <Nav>
          <LoginDropdown />
        </Nav>
      </Navbar.Collapse>
    </>
  ) : (
    ""
  );

  return (
    <Navbar id={id}>
      <Navbar.Brand href={URLs.ims} id="nav_home_link">
        <Image
          id="nav_home_image"
          width="50"
          height="33"
          alt="Ranger IMS"
          src={logo}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive_navbar_nav" />
      {controls}
    </Navbar>
  );
};

export default NavigationBar;
