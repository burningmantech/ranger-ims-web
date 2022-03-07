import invariant from "invariant";

import { useContext, useEffect } from "react";

import { IMSContext } from "./context";

const useIMS = () => {
  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  return ims;
};

const tryWithFallback = async (description, fallback, f, ...args) => {
  try {
    return await f.apply(null, args);
  } catch (e) {
    console.error(`Unable to ${description}: ${e.message}`);
    console.error(e);
    return fallback;
  }
};

export const useBag = ({ setBag }) => {
  invariant(setBag != null, "setBag property is required");

  const ims = useIMS();

  useEffect(() => {
    let ignore = false;

    const fetchBag = async () => {
      const bag = await tryWithFallback("fetch bag", null, ims.bag);

      if (!ignore) {
        setBag(bag);
      }
    };

    fetchBag();

    return () => {
      ignore = true;
    };
  }, [ims, setBag]);
};

export const useEvents = ({ setEvents }) => {
  invariant(setEvents != null, "setEvents property is required");

  const ims = useIMS();

  useEffect(() => {
    let ignore = false;

    const fetchEvents = async () => {
      const events = await tryWithFallback("fetch events", null, ims.events);

      if (!ignore) {
        setEvents(events);
      }
    };

    fetchEvents();

    return () => {
      ignore = true;
    };
  }, [ims, setEvents]);
};

export const useEvent = ({ eventID, setEvent }) => {
  invariant(eventID != null, "eventID property is required");
  invariant(setEvent != null, "setEvent property is required");

  const ims = useIMS();

  useEffect(() => {
    let ignore = false;

    const fetchEvent = async () => {
      const event = await tryWithFallback(
        "fetch event",
        null,
        ims.eventWithID,
        eventID
      );

      if (!ignore) {
        setEvent(event);
      }
    };

    fetchEvent();

    return () => {
      ignore = true;
    };
  }, [ims, eventID, setEvent]);
};

export const useIncidents = ({ eventID, searchInput, setIncidents }) => {
  invariant(eventID != null, "eventID property is required");
  invariant(setIncidents != null, "setIncidents property is required");
  invariant(searchInput != null, "searchInput property is required");

  const ims = useIMS();

  useEffect(() => {
    let ignore = false;

    const fetchIncidents = async () => {
      const incidents = searchInput
        ? await tryWithFallback(
            "search incidents",
            null,
            ims.search,
            eventID,
            searchInput
          )
        : await tryWithFallback(
            "fetch incidents",
            null,
            ims.incidents,
            eventID
          );

      if (!ignore) {
        setIncidents(incidents);
      }
    };

    fetchIncidents();

    return () => {
      ignore = true;
    };
  }, [ims, eventID, searchInput, setIncidents]);
};

export const useIncident = ({ eventID, incidentNumber, setIncident }) => {
  invariant(eventID != null, "eventID property is required");
  invariant(incidentNumber != null, "incidentNumber property is required");
  invariant(setIncident != null, "setIncident property is required");

  const ims = useIMS();

  useEffect(() => {
    let ignore = false;

    const fetchIncident = async () => {
      const incident = await tryWithFallback(
        "fetch incident",
        null,
        ims.incidentWithNumber,
        eventID,
        incidentNumber
      );

      if (!ignore) {
        setIncident(incident);
      }
    };

    fetchIncident();

    return () => {
      ignore = true;
    };
  }, [ims, eventID, incidentNumber, setIncident]);
};

export const useAllConcentricStreets = ({ setAllConcentricStreets }) => {
  invariant(
    setAllConcentricStreets != null,
    "setAllConcentricStreets property is required"
  );

  const ims = useIMS();

  useEffect(() => {
    let ignore = false;

    const fetchConcentricStreets = async () => {
      const concentricStreets = await tryWithFallback(
        "fetch all concentric streets",
        null,
        ims.allConcentricStreets
      );

      if (!ignore) {
        setAllConcentricStreets(concentricStreets);
      }
    };

    fetchConcentricStreets();

    return () => {
      ignore = true;
    };
  }, [ims, setAllConcentricStreets]);
};

export const useConcentricStreets = ({ eventID, setConcentricStreets }) => {
  invariant(eventID != null, "eventID property is required");
  invariant(
    setConcentricStreets != null,
    "setConcentricStreets property is required"
  );

  const ims = useIMS();

  useEffect(() => {
    let ignore = false;

    const fetchConcentricStreets = async () => {
      const concentricStreets = await tryWithFallback(
        "fetch event concentric streets",
        [],
        ims.concentricStreets,
        eventID
      );

      if (!ignore) {
        setConcentricStreets(concentricStreets);
      }
    };

    fetchConcentricStreets();

    return () => {
      ignore = true;
    };
  }, [ims, eventID, setConcentricStreets]);
};
