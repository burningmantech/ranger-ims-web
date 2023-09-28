import invariant from "invariant";

import { useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";

import { useConcentricStreetsByEvent, useIncidents } from "../../ims/effects";
import Incident from "../../ims/model/Incident";

import Loading from "../base/Loading";
import { useDispatchQueueTable } from "./hooks";
import BottomToolBar from "./BottomToolBar";
import DispatchQueueTable from "./DispatchQueueTable";
import TopToolBar from "./TopToolBar";

// DispatchQueue component

const DispatchQueue = ({ event }) => {
  invariant(event != null, "event property is required");

  // State

  const [showState, setShowState] = useState("open"); // all, open, active
  const [showDays, setShowDays] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  // Fetch concentric street data

  const [concentricStreetsByEvent, setConcentricStreetsByEvent] = useState();

  useConcentricStreetsByEvent({
    setConcentricStreetsByEvent: setConcentricStreetsByEvent,
  });

  // Fetch incident data

  const [incidents, setIncidents] = useState();

  useIncidents({
    eventID: event.id,
    setIncidents: setIncidents,
    searchInput: searchInput,
  });

  const table = useDispatchQueueTable(incidents, concentricStreetsByEvent);

  // Render

  return (
    <div id="queue_wrapper">
      <h1>Dispatch Queue: {event.name}</h1>

      <Loading
        condition={concentricStreetsByEvent}
        error={concentricStreetsByEvent === null}
        what={"concentric street names"}
      />

      <Loading
        condition={incidents}
        error={incidents === null}
        what={"incidents"}
      >
        <TopToolBar
          table={table}
          incidents={incidents}
          showState={showState}
          setShowState={setShowState}
          showDays={showDays}
          setShowDays={setShowDays}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        <DispatchQueueTable table={table} event={event} />
        <BottomToolBar table={table} incidents={incidents} />
      </Loading>
    </div>
  );
};

export default DispatchQueue;
