import invariant from "invariant";
import { DateTime } from "luxon";

import ListGroup from "react-bootstrap/ListGroup";

const ReportEntry = ({ reportEntry }) => {
  invariant(reportEntry != null, "reportEntry property is required");

  const iso = reportEntry.created.toISO();
  const className = reportEntry.systemEntry
    ? "report_entry_system"
    : "report_entry_user";

  const splitText = (text) => {
    return text.split(/\r?\n|\r|\n/g);
  };

  return (
    <div className={"report_entry " + className}>
      <p className="report_entry_metadata">
        <time dateTime={iso} className="report_entry_datetime">
          {reportEntry.created.toLocaleString(
            DateTime.DATETIME_HUGE_WITH_SECONDS,
          )}
        </time>
        <>, </>
        <span className="report_entry_author">{reportEntry.author}</span>:
      </p>
      <div className="report_entry_text">
        {splitText(reportEntry.text).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default ReportEntry;
