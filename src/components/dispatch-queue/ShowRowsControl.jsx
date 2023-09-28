import invariant from "invariant";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import { defaultPageSize } from "./format";

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

export default ShowRowsControl;
