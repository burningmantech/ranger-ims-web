import { DateTime } from "luxon";

import ReportEntry from "./ReportEntry";

describe("ReportEntry", () => {
  test("toString, not system entry", () => {
    const created = DateTime.fromISO("2021-08-17T17:12:46.72Z");
    const author = "bucket";
    const systemEntry = false;
    const text = "lorem ipsum…";
    const reportEntry = new ReportEntry({
      created: created,
      author: author,
      systemEntry: systemEntry,
      text: text,
    });
    const result = reportEntry.toString();

    expect(result).toEqual(`${created.toUTC()} ${author}: ${text}`);
  });

  test("toString, system entry", () => {
    const created = DateTime.fromISO("2021-08-17T17:12:46.72Z");
    const author = "bucket";
    const systemEntry = true;
    const text = "lorem ipsum…";
    const reportEntry = new ReportEntry({
      created: created,
      author: author,
      systemEntry: systemEntry,
      text: text,
    });
    const result = reportEntry.toString();

    expect(result).toEqual(`${created.toUTC()} ${author}🤖: ${text}`);
  });

  test("toJSON", () => {
    const created = DateTime.fromISO("2021-08-17T17:12:46.72Z");
    const author = "bucket";
    const systemEntry = false;
    const text = "lorem ipsum…";
    const reportEntry = new ReportEntry({
      created: created,
      author: author,
      systemEntry: systemEntry,
      text: text,
    });
    const result = reportEntry.toJSON();

    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        created: created.toUTC().toISO(),
        author: author,
        system_entry: systemEntry,
        text: text,
      }),
    );
  });
});
