import invariant from "invariant";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";
import Page from "../components/Page";
import DispatchQueue from "../components/DispatchQueue";


export const EventPage = (props) => {
  const imsContext = useContext(IMSContext);
  invariant(imsContext != null, "IMS context is required");
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  // Fetch data

  const [event, setEvent] = useState(undefined);

  useEffect(
    () => {
      const eventID = () => {
        invariant(props.id != null, "id property is required");
        return props.id;
      }

      let ignore = false;

      const fetchEvent = async () => {
        let event;
        try {
          event = await ims.eventWithID(eventID());
        }
        catch (e) {
          console.error(`Unable to fetch event: ${e.message}`);
          event = null;
        }

        if (! ignore) { setEvent(event); }
      }

      fetchEvent();

      return () => { ignore = true; }
    }, [ims, props.id, props.match]
  );

  // Render

  if (event === undefined) {
    return <Loading />;
  } else if (event === null) {
    return "Error loading event";
  }

  return (
    <Page>
      <h1>Event: {event.name}</h1>

      <DispatchQueue event={event} />
    </Page>
  );
}

export const RoutedEventPage = () => {
  const params = useParams();

  invariant(params.eventID != null, "eventID parameter is required: " + JSON.stringify(params));

  return (
    <EventPage id={params.eventID} />
  );
}

export default RoutedEventPage;
