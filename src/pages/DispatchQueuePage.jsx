import invariant from "invariant";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { IMSContext } from "../ims/context";
import { useEvent } from "../ims/effects";

import Loading from "../components/base/Loading";
import DispatchQueue from "../components/DispatchQueue";
import Page from "../components/Page";

export const DispatchQueuePage = ({ eventID }) => {
  const imsContext = useContext(IMSContext);
  invariant(imsContext != null, "IMS context is required");
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  // Fetch data

  const [event, setEvent] = useState(undefined);

  useEvent({ eventID: eventID, setEvent: setEvent });

  // Render

  return (
    <Loading condition={event} error={event === null} what="event">
      <Page>
        <DispatchQueue event={event} />
      </Page>
    </Loading>
  );
};

export const RoutedDispatchQueuePage = () => {
  const params = useParams();

  invariant(
    params.eventID != null,
    "eventID parameter is required: " + JSON.stringify(params),
  );

  return <DispatchQueuePage eventID={params.eventID} />;
};

export default RoutedDispatchQueuePage;
