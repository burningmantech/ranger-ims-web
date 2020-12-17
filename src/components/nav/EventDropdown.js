import { Component } from "react";

import NavDropdown from "react-bootstrap/NavDropdown";

import { IMSContext } from "../../ims/context";


export default class EventDropdown extends Component {

  static contextType = IMSContext;

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = () => {
    this.fetch();  // no await needed
  }

  fetch = async () => {
    const context = this.context;
    if (context === undefined) {
      throw new Error(`No context provided to ${this.constructor.name}.`);
    }

    const ims = context.ims;
    if (ims == null) {
      throw new Error(`No IMS provided to ${this.constructor.name}.`);
    }

    let events;
    try {
      events = await ims.events();
    }
    catch (e) {
      console.log(`Unable to load ${this.constructor.name}: ${e}`);
      events = null;
    }

    this.setState({ events: events });
  }

  render = () => {
    const items = () => {
      const events = this.state.events;

      if (events === undefined) {
        return (
          <NavDropdown.Item className="text-warning">
            Loading Events…
          </NavDropdown.Item>
        );
      }

      if (events === null) {
        return (
          <NavDropdown.Item className="text-danger">
            Error Loading Events
          </NavDropdown.Item>
        );
      }

      if (events.length === 0) {
        return (
          <NavDropdown.Item className="text-info">
            No Events Found
          </NavDropdown.Item>
        );
      }

      return events.map(
        (event) => {
          return (
            <NavDropdown.Item key={event.id} href="#events/{id}">
              {event.name}
            </NavDropdown.Item>
          );
        }
      );
    }

    return (
      <NavDropdown title="Event" id="nav_events_dropdown">
        {items()}
      </NavDropdown>
    );
  }

}
