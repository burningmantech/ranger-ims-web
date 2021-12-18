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
