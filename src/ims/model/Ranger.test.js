import Ranger from "./Ranger";

describe("Ranger", () => {
  test("statusToString, valid", () => {
    expect(Ranger.statusToString("active")).toEqual("Active Ranger");
    expect(Ranger.statusToString("inactive")).toEqual("Inactive Ranger");
    expect(Ranger.statusToString("vintage")).toEqual("Vintage Ranger");
    expect(Ranger.statusToString("other")).toEqual("(Unknown Person Type)");
  });

  test("statusToString, invalid", () => {
    for (const value of [-1, "XYZZY"]) {
      expect(() => Ranger.statusToString(value)).toThrow(
        `Invalid status: ${value}`,
      );
    }
  });

  test("toString", () => {
    const handle = "Bucket";
    const name = "Cylin Dricalcon Tainer";
    const status = "active";
    const email = ["bucket@example.com"];
    const enabled = true;
    const directoryID = "A637";
    const ranger = new Ranger({
      handle,
      name,
      status,
      email,
      enabled,
      directoryID,
    });
    const result = ranger.toString();

    expect(result).toEqual(
      `${Ranger.statusToString(status)} ${handle} (${name})`,
    );
  });
});
