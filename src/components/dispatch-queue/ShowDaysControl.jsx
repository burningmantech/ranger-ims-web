import invariant from "invariant";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

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

export default ShowDaysControl;
