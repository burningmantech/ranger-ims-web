import invariant from "invariant";

import { useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useConcentricStreetsByEvent, useIncidents } from "../../ims/effects";
import Incident from "../../ims/model/Incident";
import { SearchIcon } from "../icons";

import Loading from "../base/Loading";
import DispatchQueueTable from "./Table";
import {
  formatAddress,
  formatArrayOfStrings,
  formatDateTime,
  formatLocation,
  formatPriority,
  formatState,
} from "./format";

export const defaultPageSize = 25;

// Table hook

const useDispatchQueueTable = (incidents, concentricStreetsByEvent) => {
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

// Table controls

export const formatShowState = (showState) => {
  switch (showState) {
    case "all":
      return "All";
    case "open":
      return "Open";
    case "active":
      return "Active";
    default:
      throw new Error(`Invalid show state: ${JSON.stringify(showState)}`);
  }
};

const ShowStateControl = ({ table, incidents, showState, setShowState }) => {
  invariant(table != null, "table argument is required");
  invariant(incidents != null, "incidents argument is required");
  invariant(showState != null, "showState argument is required");
  invariant(setShowState != null, "setShowState argument is required");

  const currentState = formatShowState(showState);

  return (
    <DropdownButton
      id="queue_show_state_dropdown"
      title={`Show ${currentState}`}
      size="sm"
      variant="default"
    >
      {["all", "open", "active"].map((showState) => (
        <Dropdown.Item
          id={`queue_show_state_${showState}`}
          key={showState}
          onClick={() => setShowState(showState)}
        >
          {formatShowState(showState)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export const formatShowDays = (showDays) => {
  switch (showDays) {
    case 0:
      return "All Days";
    case 1:
      return "Last Day";
    default:
      return `Last ${showDays} Days`;
  }
};

const ShowDaysControl = ({ table, incidents, showDays, setShowDays }) => {
  invariant(table != null, "table argument is required");
  invariant(incidents != null, "incidents argument is required");
  invariant(showDays != null, "showDays argument is required");
  invariant(setShowDays != null, "setShowDays argument is required");

  const currentDays = formatShowDays(showDays);

  return (
    <DropdownButton
      id="queue_show_days_dropdown"
      title={`Show ${currentDays}`}
      size="sm"
      variant="default"
    >
      {[0, 1, 2, 3, 4].map((showDays) => (
        <Dropdown.Item
          id={`queue_show_days_${showDays}`}
          key={showDays}
          onClick={() => setShowDays(showDays)}
        >
          {formatShowDays(showDays)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

const ShowRowsControl = ({ table, incidents }) => {
  invariant(table != null, "table argument is required");
  invariant(incidents != null, "incidents argument is required");

  const currentRows =
    table.state.pageSize === incidents.length ? "All" : table.state.pageSize;

  return (
    <DropdownButton
      id="queue_show_rows_dropdown"
      title={`Show ${currentRows} Rows`}
      size="sm"
      variant="default"
    >
      {[0, 1, 2, 4].map((multiple) => (
        <Dropdown.Item
          id={`queue_show_rows_${multiple}`}
          key={multiple}
          onClick={() =>
            table.setPageSize(
              multiple === 0 ? incidents.length : multiple * defaultPageSize,
            )
          }
        >
          {multiple === 0 ? "All" : multiple * defaultPageSize} Rows
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

const SearchBar = ({ searchInput, setSearchInput }) => {
  invariant(searchInput != null, "searchInput argument is required");
  invariant(setSearchInput != null, "setSearchInput argument is required");

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <Form.Group id="search_bar" controlId="search_input">
      <Form.Label size="sm">
        <SearchIcon />
      </Form.Label>
      <Form.Control
        type="search"
        placeholder="Search"
        value={searchInput}
        inputMode="latin"
        autoComplete="off"
        size="sm"
        onChange={handleSearchInput}
      />
    </Form.Group>
  );
};

const TopToolBar = ({
  table,
  incidents,
  searchInput,
  setSearchInput,
  showState,
  setShowState,
  showDays,
  setShowDays,
}) => {
  if (incidents == null) {
    return "";
  }

  invariant(table != null, "table argument is required");
  invariant(searchInput != null, "searchInput argument is required");
  invariant(setSearchInput != null, "setSearchInput argument is required");
  invariant(showState != null, "showState argument is required");
  invariant(setShowState != null, "setShowState argument is required");
  invariant(showDays != null, "showDays argument is required");
  invariant(setShowDays != null, "setShowDays argument is required");

  return (
    <Row id="queue_top_toolbar">
      {/*
        <p>
          <a href="../incident_reports/">
            <span className="glyphicon glyphicon-arrow-right" /> Incident Reports
          </a>
        </p>
   */}

      <Col sm={5}>
        <ButtonGroup id="queue_nav_controls" size="sm">
          <Button id="queue_new_incident" variant="primary" size="sm">
            New
          </Button>
        </ButtonGroup>

        <ButtonGroup id="queue_display_controls" size="sm">
          <ShowStateControl
            table={table}
            incidents={incidents}
            showState={showState}
            setShowState={setShowState}
          />
          <ShowDaysControl
            table={table}
            incidents={incidents}
            showDays={showDays}
            setShowDays={setShowDays}
          />
          <ShowRowsControl table={table} incidents={incidents} />
        </ButtonGroup>
      </Col>

      <Col sm={7}>
        <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
      </Col>
    </Row>
  );
};

const BottomToolBar = ({ table, incidents }) => {
  return "";
  // return (
  //   <Row>
  //     <Col>
  //       <div>
  //         <button
  //           onClick={() => table.gotoPage(0)}
  //           disabled={!table.canPreviousPage}
  //         >
  //           {"<<"}
  //         </button>{" "}
  //         <button
  //           onClick={() => table.previousPage()}
  //           disabled={!table.canPreviousPage}
  //         >
  //           {"<"}
  //         </button>{" "}
  //         <button
  //           onClick={() => table.nextPage()}
  //           disabled={!table.canNextPage}
  //         >
  //           {">"}
  //         </button>{" "}
  //         <button
  //           onClick={() => table.gotoPage(table.pageCount - 1)}
  //           disabled={!table.canNextPage}
  //         >
  //           {">>"}
  //         </button>{" "}
  //         <span>
  //           Page{" "}
  //           <strong>
  //             {table.state.pageIndex + 1} of {table.pageOptions.length}
  //           </strong>{" "}
  //         </span>
  //         <span>
  //           | Go to page:{" "}
  //           <input
  //             type="number"
  //             defaultValue={table.state.pageIndex + 1}
  //             onChange={(e) => {
  //               const page = e.target.value ? Number(e.target.value) - 1 : 0;
  //               table.gotoPage(page);
  //             }}
  //             style={{ width: "100px" }}
  //           />
  //         </span>{" "}
  //         <select
  //           value={table.state.pageSize}
  //           onChange={(e) => {
  //             table.setPageSize(Number(e.target.value));
  //           }}
  //         >
  //           {[25, 50, 100].map((pageSize) => (
  //             <option key={pageSize} value={pageSize}>
  //               Show {pageSize}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
  //     </Col>
  //   </Row>
  // );
};

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
