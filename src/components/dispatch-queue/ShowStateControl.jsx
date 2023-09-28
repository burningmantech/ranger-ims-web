import invariant from "invariant";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

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

export default ShowStateControl;
