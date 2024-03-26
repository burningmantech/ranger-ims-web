import invariant from "invariant";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import { URLs } from "../../URLs";

export const DispatchQueueTable = ({ table, event }) => {
  invariant(table != null, "table argument is required");
  invariant(event != null, "event argument is required");

  const handleRowClick = (incidentNumber) => {
    const url = URLs.incident(event.id, incidentNumber);
    const context = `${event.id}:${incidentNumber}`;
    window.open(url, context);
  };

  return (
    <Row>
      <Col>
        {/* Table of incidents */}

        <Table striped hover id="queue_table" {...table.getTableProps()}>
          <thead>
            {table.headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...table.getTableBodyProps()}>
            {table.page.map((row, _i) => {
              table.prepareRow(row);
              return (
                <tr
                  className="queue_incident_row"
                  onClick={() => handleRowClick(row.cells[0].value)}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        className={`queue_incident_${cell.column.id}`}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default DispatchQueueTable;
