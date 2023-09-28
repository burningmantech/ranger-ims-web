import { formatShowDays } from "./ShowDaysControl";

describe("formatShowDays", () => {
  test("formatShowDays, valid", () => {
    expect(formatShowDays(0)).toEqual("All Days");
    expect(formatShowDays(1)).toEqual("Last Day");
    expect(formatShowDays(2)).toEqual("Last 2 Days");
    expect(formatShowDays(3)).toEqual("Last 3 Days");
    expect(formatShowDays(4)).toEqual("Last 4 Days");
  });
});
