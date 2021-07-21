import invariant from "invariant";
import { useContext, useEffect, useState } from "react";

import NavDropdown from "react-bootstrap/NavDropdown";

import { URLs } from "../../URLs";
import { IMSContext } from "../../ims/context";


const EventDropdown = (props) => {
  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  // Fetch data

  const [events, setEvents] = useState(undefined);

  useEffect(
    () => {
      let ignore = false;

      const fetchEvents = async () => {
        let events;
        try {
          events = await ims.events();
        }
        catch (e) {
          console.error(`Unable to fetch events: ${e.message}`);
          events = null;
        }

        if (! ignore) { setEvents(events); }
      }

      fetchEvents();

      return () => { ignore = true; }
    }, [ims]
  );

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

export default EventDropdown;
