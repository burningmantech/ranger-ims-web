import ConcentricStreet from "./ConcentricStreet";

describe("ConcentricStreet", () => {
  test("toString", () => {
    const id = "1";
    const name = "One";
    const concentricStreet = new ConcentricStreet(id, name);
    const result = concentricStreet.toString();

    expect(result).toEqual(name);
  });

  test("toJSON", () => {
    const id = "1";
    const name = "One";
    const concentricStreet = new ConcentricStreet(id, name);
    const concentricStreetJSON = { id: id, name: name };
    const result = concentricStreet.toJSON();

    expect(result).toEqual(concentricStreetJSON);
  });

  test("fromJSON, valid", () => {
    const id = "1";
    const name = "One";
    const concentricStreet = new ConcentricStreet(id, name);
    const concentricStreetJSON = concentricStreet.toJSON();
    const result = ConcentricStreet.fromJSON(concentricStreetJSON);
    const resultJSON = result.toJSON();

    expect(resultJSON).toEqual(concentricStreetJSON);
  });

  test("fromJSON, invalid", () => {
    expect(() => ConcentricStreet.fromJSON({})).toThrow(
      `Invalid concentric street JSON: {}`
    );
  });

  test("JSON round-trip through text", () => {
    const id = "1";
    const name = "One";
    const concentricStreet = new ConcentricStreet(id, name);
    const concentricStreetJSON = concentricStreet.toJSON();
    const concentricStreetJSONText = JSON.stringify(concentricStreetJSON);
    const result = ConcentricStreet.fromJSON(concentricStreetJSON);
    const resultJSONText = JSON.stringify(result.toJSON());

    expect(resultJSONText).toEqual(concentricStreetJSONText);
  });
});
