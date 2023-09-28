import { formatShowState } from "./ShowStateControl";

describe("formatShowState", () => {
  test("formatShowState, valid", () => {
    expect(formatShowState("all")).toEqual("All");
    expect(formatShowState("open")).toEqual("Open");
    expect(formatShowState("active")).toEqual("Active");
  });

  test("formatShowState, invalid", () => {
    expect(() => formatShowState(-1)).toThrow("Invalid show state: -1");
    expect(() => formatShowState("XYZZY")).toThrow(
      'Invalid show state: "XYZZY"',
    );
  });
});
