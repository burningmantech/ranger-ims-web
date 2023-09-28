import { render } from "@testing-library/react";

import { DateTime } from "luxon";

import ReportEntryModel from "../../ims/model/ReportEntry";
import ReportEntry from "./ReportEntry";

describe("ReportEntry component: display", () => {
  test.each([false, true])(
    "rendered data, systemEntry=%s",
    async (systemEntry) => {
      const created = DateTime.fromISO("2021-08-17T17:12:46.72Z").toUTC();
      const author = "bucket";
      const text = "lorem ipsum…\nthere once was a Khaki named Sam…\nI am";
      const reportEntry = new ReportEntryModel({
        created: created,
        author: author,
        systemEntry: systemEntry,
        text: text,
      });

      render(<ReportEntry reportEntry={reportEntry} />);

      expect(
        document.getElementsByClassName("report_entry_datetime")[0].textContent,
      ).toEqual(created.toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS));

      expect(
        document.getElementsByClassName("report_entry_author")[0].textContent,
      ).toEqual(author);

      expect(
        document.getElementsByClassName("report_entry_text")[0].textContent,
      ).toEqual(text.replace(/[\n\r]/g, ""));

      expect(
        document.getElementsByClassName("report_entry_system").length,
      ).toEqual(systemEntry ? 1 : 0);

      expect(
        document.getElementsByClassName("report_entry_user").length,
      ).toEqual(systemEntry ? 0 : 1);
    },
  );
});
