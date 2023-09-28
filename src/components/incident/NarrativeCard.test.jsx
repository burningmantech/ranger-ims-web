import { render, screen } from "@testing-library/react";

import { DateTime } from "luxon";

import ReportEntry from "../../ims/model/ReportEntry";
import NarrativeCard from "./NarrativeCard";

describe("NarrativeCard component: display", () => {
  test("rendered report entries", async () => {
    const reportEntries = [
      new ReportEntry({
        created: DateTime.fromISO("2021-08-17T17:12:46.72Z").toUTC(),
        author: "bucket",
        systemEntry: true,
        text: "1",
      }),
      new ReportEntry({
        created: DateTime.fromISO("2021-08-17T18:44:55Z").toUTC(),
        author: "hubcap",
        systemEntry: false,
        text: "1",
      }),
    ];

    render(<NarrativeCard reportEntries={reportEntries} />);

    expect(
      Array.from(document.getElementsByClassName("report_entry_datetime")).map(
        (e) => e.textContent,
      ),
    ).toEqual(
      reportEntries
        .filter((e) => !e.systemEntry)
        .map((e) =>
          e.created.toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS),
        ),
    );

    expect(
      Array.from(document.getElementsByClassName("report_entry_author")).map(
        (e) => e.textContent,
      ),
    ).toEqual(reportEntries.filter((e) => !e.systemEntry).map((e) => e.author));

    expect(
      Array.from(document.getElementsByClassName("report_entry_text")).map(
        (e) => e.textContent,
      ),
    ).toEqual(
      reportEntries
        .filter((e) => !e.systemEntry)
        .map((e) => e.text.replace(/[\n\r]/g, "")),
    );

    expect(
      document.getElementsByClassName("report_entry_system").length,
    ).toEqual(0);

    expect(document.getElementsByClassName("report_entry_user").length).toEqual(
      reportEntries.filter((e) => !e.systemEntry).length,
    );
  });
});
