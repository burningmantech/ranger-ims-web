import { Component } from "react";

import NavDropdown from "react-bootstrap/NavDropdown";


export default class EventDropdown extends Component {

  render() {
    return (
      <NavDropdown title="Event" id="nav_events_dropdown">
        <NavDropdown.Item href="#events/2020">2020</NavDropdown.Item>
        <NavDropdown.Item href="#events/2019">2019</NavDropdown.Item>
        <NavDropdown.Item href="#events/2018">2018</NavDropdown.Item>
      </NavDropdown>
    );
  }

}
