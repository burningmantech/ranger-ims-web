import invariant from "invariant";
import { useState } from "react";

import NavDropdown from "react-bootstrap/NavDropdown";

import { URLs } from "../../URLs";
import { IMSContext } from "../../ims/context";
import { useEvents } from "../../ims/effects";

const EventDropdown = () => {
  // Fetch data

  const [events, setEvents] = useState(undefined);

  useEvents({ setEvents: setEvents });

  // Render

  const items = () => {
    if (events === undefined) {
      return (
        <NavDropdown.Item className="text-warning">
          Loading events…
        </NavDropdown.Item>
      );
    }

    if (events === null) {
      return (
        <NavDropdown.Item className="text-danger">
          Error loading events
        </NavDropdown.Item>
      );
    }

    if (events.length === 0) {
      return (
        <NavDropdown.Item className="text-info">
          No events found
        </NavDropdown.Item>
      );
    }

    return events.sort().map((event) => {
      return (
        <NavDropdown.Item
          key={event.id}
          className="nav_event_id"
          href={URLs.event(event.id)}
        >
          {event.name}
        </NavDropdown.Item>
      );
    });
  };

  return (
    <NavDropdown title="Event" id="nav_events_dropdown">
      {items()}
    </NavDropdown>
  );
};

export default EventDropdown;
