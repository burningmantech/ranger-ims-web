import invariant from "invariant";
import { Component } from "react";

import NavDropdown from "react-bootstrap/NavDropdown";

import { URLs } from "../../URLs";
import { IMSContext } from "../../ims/context";


export default class EventDropdown extends Component {

  static contextType = IMSContext;

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = () => {
    this._setEvents = (events) => { this.setState({ events: events }) };
    this._fetchPromise = this.fetch();  // no await needed
  }

  componentWillUnmount = () => {
    this._setEvents = (events) => {
      console.debug(
        `Received events after ${this.constructor.name} unmounted.`
      );
    };
  }

  fetch = async () => {
    const context = this.context;
    invariant(
      context !== undefined,
      `No context provided to ${this.constructor.name}.`,
    );

    const ims = context.ims;
    invariant(ims != null, `No IMS provided to ${this.constructor.name}.`);

    let events;
    try {
      events = await ims.events();
    }
    catch (e) {
      console.error(`Unable to load ${this.constructor.name}: ${e.message}`);
      events = null;
    }
    this._setEvents(events);
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
            <NavDropdown.Item key={event.id} href={URLs.event(event)}>
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
