import invariant from "invariant";
import { useContext, useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import Table from "react-bootstrap/Table";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";


export const formatPriority = ({value}) => {
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


export const formatDateTime = ({value}) => {
  return value.toFormat("ccc L/c HH:mm");
}


export const formatState = ({value}) => {
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


export const formatLocation = ({value}) => {
  // console.error("Location " + JSON.stringify(value));
  return "?";
}


export const formatArrayOfStrings = ({value}) => {
  if (! value) {
    return "";
  }
  return value.sort().join(", ");
}


export const defaultPageCount = 25;


const DispatchQueueTable = ({columns, data}) => {
  // This uses React Table:
  // https://react-table.tanstack.com/docs/overview

  // Search input handler

  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
    console.info("Set Search: " + event.target.value);
  }

  // Create React Table

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // rows,

    // usePagination:
    // https://react-table.tanstack.com/docs/api/usePagination
    page,  // Rows on current page
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    // State
    state: { pageIndex, pageSize },
  } = useTable(
    {columns, data, initialState: {pageSize: 25, pageIndex: 0}},
    usePagination
  );

  return (
    <>

{/*
      <p>
        <a href="../incident_reports/">
          <span className="glyphicon glyphicon-arrow-right" /> Incident Reports
        </a>
      </p>
 */}

      <div id="button_container" className="btn-group col-sm-5" role="group">

{/*
        // New incident button

        <div className="btn-group new_incident" role="group">
          <a href="./new" target="_blank">
            <button
              id="new_incident"
              type="button"
              className="btn btn-sm btn-default btn-primary"
            >
              New
            </button>
          </a>
        </div>
*/}

{/*
        // Show All/Open/Active control

        <div className="btn-group" role="group">
          <button
            id="show_state"
            type="button"
            className="btn btn-sm btn-default"
            data-toggle="dropdown"
          >
            Show
            <span className="selection">All</span>
            <span className="caret" />
          </button>
          <ul className="dropdown-menu">
            <li id="show_state_all" onclick="showState('all');">
              <span className="checkmark" /><a href="#" className="name">All   </a>
            </li>
            <li id="show_state_open" onclick="showState('open');">
              <span className="checkmark" /><a href="#" className="name">Open  </a>
            </li>
            <li id="show_state_active" onclick="showState('active');">
              <span className="checkmark" /><a href="#" className="name">Active</a>
            </li>
          </ul>
        </div>
*/}

{/*
        // Show # of days control

        <div className="btn-group" role="group">
          <button
            id="show_days"
            type="button"
            className="btn btn-sm btn-default"
            data-toggle="dropdown"
          >
            Show
            <span className="selection">All Days</span>
            <span className="caret" />
          </button>
          <ul className="dropdown-menu">
            <li id="show_days_all" onclick="showDays(null);">
              <span className="checkmark" /><a href="#" className="name">All Days</a>
            </li>
            <li id="show_days_0" onclick="showDays(0);">
              <span className="checkmark" /><a href="#" className="name">Today</a>
            </li>
            <li id="show_days_1" onclick="showDays(1);">
              <span className="checkmark" /><a href="#" className="name">Last 2 Days</a>
            </li>
            <li id="show_days_2" onclick="showDays(2);">
              <span className="checkmark" /><a href="#" className="name">Last 3 Days</a>
            </li>
            <li id="show_days_3" onclick="showDays(3);">
              <span className="checkmark" /><a href="#" className="name">Last 4 Days</a>
            </li>
          </ul>
        </div>
*/}

{/*
        // Show # of rows control
        // https://react-table.tanstack.com/docs/examples/pagination

        <div className="btn-group" role="group">
          <button
            id="show_rows"
            type="button"
            className="btn btn-sm btn-default"
            data-toggle="dropdown"
          >
            Show
            <span className="selection">All Rows</span>
            <span className="caret" />
          </button>
          <ul className="dropdown-menu">
            <li id="show_rows_all" onclick="showRows(null);">
              <span className="checkmark" /><a href="#" className="name">All Rows</a>
            </li>
            <li id="show_rows_25"  onclick="showRows(  25);">
              <span className="checkmark" /><a href="#" className="name">25 Rows</a>
            </li>
            <li id="show_rows_50"  onclick="showRows(  50);">
              <span className="checkmark" /><a href="#" className="name">50 Rows</a>
            </li>
            <li id="show_rows_100" onclick="showRows( 100);">
              <span className="checkmark" /><a href="#" className="name">100 Rows</a>
            </li>
          </ul>
         </div>
*/}

      </div>

      {/* Search field */}

      <div id="search_container" className="form-group form-group-sm col-sm-7">
        <div className="flex-input-container">
          <label className="control-label" htmlFor="search_input">
            <span className="glyphicon glyphicon-search" />
          </label>
          <input
            id="search_input"
            type="search"
            className="form-control"
            placeholder="Search"
            value={search}
            inputMode="latin"
            autoComplete="off"
            onChange={handleSearch}
            aria-controls="queue_table"
          />
        </div>
      </div>

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
            page.map(
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

      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[25, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

    </>
  );
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
      {
        accessor: "location",
        Header: "Location",
        Cell: formatLocation,
      },
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
