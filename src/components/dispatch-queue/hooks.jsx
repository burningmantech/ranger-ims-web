import { useMemo } from "react";
import { usePagination, useTable } from "react-table";

import {
  defaultPageSize,
  formatArrayOfStrings,
  formatDateTime,
  formatLocation,
  formatPriority,
  formatState,
} from "./format";

export const useDispatchQueueTable = (incidents, concentricStreetsByEvent) => {
  concentricStreetsByEvent = useMemo(
    () =>
      concentricStreetsByEvent == null ? new Map() : concentricStreetsByEvent,
    [concentricStreetsByEvent],
  );

  // See: https://react-table.tanstack.com/docs/overview

  const data = useMemo(() => (incidents == null ? [] : incidents), [incidents]);

  const columns = useMemo(
    () => [
      {
        id: "number",
        accessor: (incident) => incident.number,
        Header: <abbr title="Number">#</abbr>,
      },
      {
        id: "priority",
        accessor: (incident) => formatPriority(incident.priority),
        Header: <abbr title="Priority">Pri</abbr>,
      },
      {
        id: "created",
        accessor: (incident) => formatDateTime(incident.created),
        Header: "Created",
      },
      {
        id: "state",
        accessor: (incident) => formatState(incident.state),
        Header: "State",
      },
      {
        id: "ranger_handles",
        accessor: (incident) => formatArrayOfStrings(incident.rangerHandles),
        Header: "Rangers",
      },
      {
        id: "location",
        accessor: (incident) =>
          formatLocation(
            incident.location,
            concentricStreetsByEvent.get(incident.eventID),
          ),
        Header: "Location",
      },
      {
        id: "incident_types",
        accessor: (incident) => formatArrayOfStrings(incident.incidentTypes),
        Header: "Types",
      },
      {
        id: "summary",
        accessor: (incident) => incident.summarize(),
        Header: "Summary",
      },
    ],
    [concentricStreetsByEvent],
  );

  return useTable(
    { columns, data, initialState: { pageSize: defaultPageSize } },
    usePagination,
  );
};
