import invariant from "invariant";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import Table from "react-bootstrap/Table";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";


const DispatchQueueTable = ({columns, data}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns, data});

  return (
    <>

{/*
      <p>
        <a href="../incident_reports/">
          <span class="glyphicon glyphicon-arrow-right" /> Incident Reports
        </a>
      </p>
 */}

      <div id="button_container" class="btn-group col-sm-5" role="group">

{/*
        // New incident button

        <div class="btn-group new_incident" role="group">
          <a href="./new" target="_blank">
            <button
              id="new_incident"
              type="button"
              class="btn btn-sm btn-default btn-primary"
            >
              New
            </button>
          </a>
        </div>
*/}

{/*
        // Show All/Open/Active control

        <div class="btn-group" role="group">
          <button
            id="show_state"
            type="button"
            class="btn btn-sm btn-default"
            data-toggle="dropdown"
          >
            Show
            <span class="selection">All</span>
            <span class="caret" />
          </button>
          <ul class="dropdown-menu">
            <li id="show_state_all" onclick="showState('all');">
              <span class="checkmark" /><a href="#" class="name">All   </a>
            </li>
            <li id="show_state_open" onclick="showState('open');">
              <span class="checkmark" /><a href="#" class="name">Open  </a>
            </li>
            <li id="show_state_active" onclick="showState('active');">
              <span class="checkmark" /><a href="#" class="name">Active</a>
            </li>
          </ul>
        </div>
*/}

{/*
        // Show # of days control

        <div class="btn-group" role="group">
          <button
            id="show_days"
            type="button"
            class="btn btn-sm btn-default"
            data-toggle="dropdown"
          >
            Show
            <span class="selection">All Days</span>
            <span class="caret" />
          </button>
          <ul class="dropdown-menu">
            <li id="show_days_all" onclick="showDays(null);">
              <span class="checkmark" /><a href="#" class="name">All Days</a>
            </li>
            <li id="show_days_0" onclick="showDays(0);">
              <span class="checkmark" /><a href="#" class="name">Today</a>
            </li>
            <li id="show_days_1" onclick="showDays(1);">
              <span class="checkmark" /><a href="#" class="name">Last 2 Days</a>
            </li>
            <li id="show_days_2" onclick="showDays(2);">
              <span class="checkmark" /><a href="#" class="name">Last 3 Days</a>
            </li>
            <li id="show_days_3" onclick="showDays(3);">
              <span class="checkmark" /><a href="#" class="name">Last 4 Days</a>
            </li>
          </ul>
        </div>
*/}

{/*
        // Show # of rows control

        <div class="btn-group" role="group">
          <button
            id="show_rows"
            type="button"
            class="btn btn-sm btn-default"
            data-toggle="dropdown"
          >
            Show
            <span class="selection">All Rows</span>
            <span class="caret" />
          </button>
          <ul class="dropdown-menu">
            <li id="show_rows_all" onclick="showRows(null);">
              <span class="checkmark" /><a href="#" class="name">All Rows</a>
            </li>
            <li id="show_rows_25"  onclick="showRows(  25);">
              <span class="checkmark" /><a href="#" class="name">25 Rows</a>
            </li>
            <li id="show_rows_50"  onclick="showRows(  50);">
              <span class="checkmark" /><a href="#" class="name">50 Rows</a>
            </li>
            <li id="show_rows_100" onclick="showRows( 100);">
              <span class="checkmark" /><a href="#" class="name">100 Rows</a>
            </li>
          </ul>
         </div>
*/}

      </div>

{/*
      // Search field

      <div id="search_container" class="form-group form-group-sm col-sm-7">
        <div class="flex-input-container">
          <label class="control-label" for="search_input">
            <span class="glyphicon glyphicon-search" />
          </label>
          <input
            id="search_input"
            type="search"
            class="form-control"
            placeholder="Search"
            inputmode="latin"
            autocomplete="off"
            aria-controls="queue_table"
          />
        </div>
      </div>
*/}

      {/* Table of incidents */}

      <Table striped hover id="queue_table" {...getTableProps()}>
        <thead>
          {
            headerGroups.map(
              headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map(
                      column => (
                        <th {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </th>
                      )
                    )
                  }
                </tr>
              )
            )
          }
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            rows.map(
              (row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(
                        cell => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          )
                        }
                      )
                    }
                  </tr>
                )
              }
            )
          }
        </tbody>
      </Table>

    </>
  );
}

const formatPriority = ({value}) => {
  switch (value) {
    case 1:
    case 2:
      return "↥";
    case 3:
      return "•";
    case 4:
    case 5:
      return "↧";
    default:
      return value;
  }
}

const formatDateTime = ({value}) => {
  return value.toFormat("ccc L/c HH:mm");
}

const formatState = ({value}) => {
  switch (value) {
    case "new":
      return "New";
    case "on_hold":
      return "On Hold";
    case "dispatched":
      return "Dispatched";
    case "on_scene":
      return "On Scene";
    case "closed":
      return "Closed";
    default:
      return value;
  }
}

const formatArrayOfStrings = ({value}) => {
  if (! value) {
    return "";
  }
  return value.sort().join(", ");
}

const DispatchQueue = (props) => {
  invariant(props.event != null, "event property is required");

  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  const columns = useMemo(
    () => [
      {
        accessor: "number",
        Header: <abbr title="Number">#</abbr>,
      },
      {
        accessor: "priority",
        Header: <abbr title="Priority">Pri</abbr>,
        Cell: formatPriority,
      },
      {
        accessor: "created",
        Header: "Created",
        Cell: formatDateTime,
      },
      {
        accessor: "state",
        Header: "State",
        Cell: formatState,
      },
      {
        accessor: "rangerHandles",
        Header: "Rangers",
        Cell: formatArrayOfStrings,
      },
      // {
      //   accessor: "location",
      //   Header: "Location",
      // },
      {
        accessor: "incidentTypes",
        Header: "Types",
        Cell: formatArrayOfStrings,
      },
      {
        accessor: "summary",
        Header: "Summary",
      },
    ],
    []
  );

  // Fetch data

  const [incidents, setIncidents] = useState(undefined);

  useEffect(
    () => {
      let ignore = false;

      const fetchIncidents = async () => {
        let incidents;
        try {
          incidents = await ims.incidents(props.event);
        }
        catch (e) {
          console.error(`Unable to fetch incidents: ${e.message}`);
          incidents = null;
        }

        if (! ignore) { setIncidents(incidents); }
      }

      fetchIncidents();

      return () => { ignore = true; }
    }, [ims, props.event]
  );

  // Render

  if (incidents === undefined) {
    return <Loading />;
  }
  else if (incidents === null) {
    return "Error loading incidents";
  }
  else {
    const data = Array.from(incidents.values());
    return (
      <div>
        <h1>Dispatch Queue: {props.event.name}</h1>
        <DispatchQueueTable columns={columns} data={data} />
      </div>
    );
  }
}

export default DispatchQueue;
