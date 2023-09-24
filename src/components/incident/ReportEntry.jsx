import invariant from "invariant";

import ListGroup from "react-bootstrap/ListGroup";

const ReportEntry = ({ reportEntry }) => {
  invariant(reportEntry != null, "reportEntry property is required");

  return (
    <ListGroup.Item key={reportEntry.created.toISO()}>
      {reportEntry.text}
    </ListGroup.Item>
  );
};

export default ReportEntry;
