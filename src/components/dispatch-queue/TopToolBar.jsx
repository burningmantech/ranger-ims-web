import invariant from "invariant";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import SearchBar from "./SearchBar";
import ShowDaysControl from "./ShowDaysControl";
import ShowRowsControl from "./ShowRowsControl";
import ShowStateControl from "./ShowStateControl";

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

export default TopToolBar;
