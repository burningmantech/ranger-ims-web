import invariant from "invariant";

import { useContext, useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";


export const defaultPageSize = 25;


// Icons


export const UnknownPriorityIcon = () => {
  // https://icons.getbootstrap.com/icons/question-circle-fill/
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
    </svg>
  );
}

export const LowPriorityIcon = () => {
  // https://icons.getbootstrap.com/icons/arrow-down-circle-fill/
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
    </svg>
  );
}

export const NormalPriorityIcon = () => {
  // https://icons.getbootstrap.com/icons/circle-fill/
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-fill" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8"/>
    </svg>
  );
}

export const HighPriorityIcon = () => {
  // https://icons.getbootstrap.com/icons/arrow-up-circle-fill/
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
    </svg>
  );
}

export const SearchIcon = () => {
  // https://icons.getbootstrap.com/icons/search/
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
  );
}


// Table cell formatting


export const formatPriority = ({value}) => {
  switch (value) {
    case 1:
    case 2:
      return <HighPriorityIcon />;
    case 3:
      return <NormalPriorityIcon />;
    case 4:
    case 5:
      return <LowPriorityIcon />;
    default:
      return <UnknownPriorityIcon />;
  }
}


export const formatDateTime = ({value}) => {
  if (!value) {
    return "";
  }
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


// Table hook


const useDispatchQueueTable = (incidents) => {
  // See: https://react-table.tanstack.com/docs/overview

  const data = useMemo(() => (incidents == null) ? [] : incidents, [incidents]);

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

  return useTable(
    {columns, data, initialState: {pageSize: defaultPageSize}},
    usePagination,
  );
}


// Table component


const DispatchQueueTable = ({table}) => {
  return (
    <Row>

      <Col>

        {/* Table of incidents */}

        <Table striped hover id="queue_table" {...table.getTableProps()}>
          <thead>
            {
              table.headerGroups.map(
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
          <tbody {...table.getTableBodyProps()}>
            {
              table.page.map(
                (row, i) => {
                  table.prepareRow(row)
                  return (
                    <tr className="queue_incident_row" {...row.getRowProps()}>
                      {
                        row.cells.map(
                        cell => {
                            return (
                              <td
                                className={`queue_incident_${cell.column.id}`}
                                {...cell.getCellProps()}
                              >
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

      </Col>

    </Row>
  );
}


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
}


const ShowStateControl = ({table, incidents, showState, setShowState}) => {
  const currentState = formatShowState(showState);

  return (
    <DropdownButton
      id="queue_show_state_dropdown"
      title={`Show ${currentState}`}
      size="sm"
      variant="default"
    >
      {
        ["all", "open", "active"].map(
          showState => (
            <Dropdown.Item
              id={`queue_show_state_${showState}`}
              key={showState}
              onClick={() => setShowState(showState)}
            >
              {formatShowState(showState)}
            </Dropdown.Item>
          )
        )
      }
    </DropdownButton>
  );
}


export const formatShowDays = (showDays) => {
  switch (showDays) {
    case 0:
      return "All Days";
    case 1:
      return "Last Day";
    default:
      return `Last ${showDays} Days`;
  }
}


const ShowDaysControl = ({table, incidents, showDays, setShowDays}) => {
  const currentDays = formatShowDays(showDays);

  return (
    <DropdownButton
      id="queue_show_days_dropdown"
      title={`Show ${currentDays}`}
      size="sm"
      variant="default"
    >
      {
        [0, 1, 2, 3, 4].map(
          showDays => (
            <Dropdown.Item
              id={`queue_show_days_${showDays}`}
              key={showDays}
              onClick={() => setShowDays(showDays)}
            >
              {formatShowDays(showDays)}
            </Dropdown.Item>
          )
        )
      }
    </DropdownButton>
  );
}


const ShowRowsControl = ({table, incidents}) => {
  const currentRows = (
    (table.state.pageSize === incidents.length) ? "All" : table.state.pageSize
  );

  return (
    <DropdownButton
      id="queue_show_rows_dropdown"
      title={`Show ${currentRows} Rows`}
      size="sm"
      variant="default"
    >
      {
        [0,1,2,4].map(
          multiple => (
            <Dropdown.Item
              id={`queue_show_rows_${multiple}`}
              key={multiple}
              onClick={
                () => table.setPageSize(
                  (multiple === 0) ? incidents.length : multiple * defaultPageSize
                )
              }
            >
              {
                (multiple === 0) ? "All" : multiple * defaultPageSize
              } Rows
            </Dropdown.Item>
          )
        )
      }
    </DropdownButton>
  );
}


const SearchBar = ({searchInput, setSearchInput}) => {
  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  }

  // Note: using Form causes submit-on-enter, which we don't want.
  // There's probably a correct way to disable that.
  return (
    // <Form>
      <Form.Group id="search_bar" controlId="search_input">
        <Form.Label size="sm"><SearchIcon /></Form.Label>
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
    // </Form>
  );
}


const TopToolBar = ({
  table, incidents,
  searchInput, setSearchInput,
  showState, setShowState,
  showDays, setShowDays,
}) => {
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
            table={table} incidents={incidents}
            showState={showState} setShowState={setShowState}
          />
          <ShowDaysControl
            table={table} incidents={incidents}
            showDays={showDays} setShowDays={setShowDays}
          />
          <ShowRowsControl table={table} incidents={incidents} />
        </ButtonGroup>

      </Col>

      <Col sm={7}>
        <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
      </Col>
    </Row>
  );
}


const BottomToolBar = ({table, incidents}) => {
  return (
    <Row>

      <Col>

        <div>
          <button onClick={() => table.gotoPage(0)} disabled={!table.canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => table.previousPage()} disabled={!table.canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => table.nextPage()} disabled={!table.canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => table.gotoPage(table.pageCount - 1)} disabled={!table.canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {table.state.pageIndex + 1} of {table.pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={table.state.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.gotoPage(page)
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={table.state.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[25, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>

      </Col>

    </Row>
  );
}


// DispatchQueue component


const DispatchQueueMain = ({table, event, incidents}) => {
  // Filtering

  const [showState, setShowState] = useState("open");  // all, open, active
  const [showDays, setShowDays] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  // Render

  return (
    <div id="queue_wrapper">
      <h1>Dispatch Queue: {event.name}</h1>

      <TopToolBar
        table={table}
        incidents={incidents}
        showState={showState} setShowState={setShowState}
        showDays={showDays} setShowDays={setShowDays}
        searchInput={searchInput} setSearchInput={setSearchInput}
      />
      <DispatchQueueTable table={table} />
      <BottomToolBar table={table} incidents={incidents} />
    </div>
  );
}


const DispatchQueue = (props) => {
  invariant(props.event != null, "event property is required");

  const imsContext = useContext(IMSContext);
  const ims = imsContext.ims;

  invariant(ims != null, "No IMS");

  // Fetch data

  const [incidents, setIncidents] = useState(undefined);

  useEffect(
    () => {
      let ignore = false;

      const fetchIncidents = async () => {
        let incidents;
        try {
          incidents = await ims.incidents(props.event.id);
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

  const table = useDispatchQueueTable(incidents);

  // Render

  if (incidents === undefined) {
    return <Loading />;
  }
  else if (incidents === null) {
    return "Error loading incidents";
  }
  else {
    return <DispatchQueueMain
      event={props.event} table={table} incidents={incidents}
    />;
  }
}

export default DispatchQueue;
