import invariant from "invariant";

import { useContext, useEffect } from "react";

import { IMSContext } from "./context";

const useIMS = () => {
  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  return ims;
};

export const useBag = ({ setBag }) => {
  invariant(setBag != null, "setBag property is required");

  const ims = useIMS();

  useEffect(() => {
    let ignore = false;

    const fetchBag = async () => {
      let bag;
      try {
        bag = await ims.bag();
      } catch (e) {
        console.error(`Unable to fetch bag: ${e.message}`);
        console.error(e);
        bag = null;
      }

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
      let events;
      try {
        events = await ims.events();
      } catch (e) {
        console.error(`Unable to fetch events: ${e.message}`);
        console.error(e);
        events = null;
      }

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
      let event;
      try {
        event = await ims.eventWithID(eventID);
      } catch (e) {
        console.error(`Unable to fetch event: ${e.message}`);
        console.error(e);
        event = null;
      }

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
      let incidents;
      try {
        if (searchInput) {
          incidents = await ims.search(eventID, searchInput);
        } else {
          incidents = await ims.incidents(eventID);
        }
      } catch (e) {
        console.error(`Unable to fetch incidents: ${e.message}`);
        console.error(e);
        incidents = null;
      }

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
      let incident;
      try {
        incident = await ims.incidentWithNumber(eventID, incidentNumber);
      } catch (e) {
        console.error(`Unable to fetch incident: ${e.message}`);
        console.error(e);
        incident = null;
      }

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
      let concentricStreets;
      try {
        concentricStreets = await ims.allConcentricStreets();
      } catch (e) {
        console.error(`Unable to fetch all concentric streets: ${e.message}`);
        console.error(e);
        concentricStreets = new Map();
      }

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
      let concentricStreets;
      try {
        concentricStreets = await ims.concentricStreets(eventID);
      } catch (e) {
        console.error(`Unable to fetch event concentric streets: ${e.message}`);
        console.error(e);
        concentricStreets = [];
      }

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
