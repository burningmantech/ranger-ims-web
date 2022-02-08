import Location from "./Location";
import RodGarettAddress from "./RodGarettAddress";

describe("Location", () => {
  test("toString, no fields", () => {
    const location = new Location({});
    const result = location.toString();

    expect(result).toEqual(`(no name) (no address)`);
  });

  test("toString, with address", () => {
    const name = "Log-Pile House";
    const description = "Here, by this lake...";
    const concentric = "0";
    const radialHour = 9;
    const radialMinute = 0;
    const address = new RodGarettAddress({
      description: description,
      concentric: concentric,
      radialHour: radialHour,
      radialMinute: radialMinute,
    });
    const location = new Location({ name: name, address: address });
    const result = location.toString();

    expect(result).toEqual(`${name} at ${address}`);
  });

  test("toString, no address", () => {
    const name = "Log-Pile House";
    const location = new Location({ name: name });
    const result = location.toString();

    expect(result).toEqual(`${name} (no address)`);
  });

  test("toJSON, with address", () => {
    const name = "Treetop House";
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
    });
    const location = new Location({ name: name, address: address });
    const locationJSON = {
      name: name,
      type: "garett",
      description: address.description,
      concentric: null,
      radial_hour: null,
      radial_minute: null,
    };
    const result = location.toJSON();

    expect(result).toEqual(locationJSON);
  });

  test("toJSON, no address", () => {
    const name = "Treetop House";
    const location = new Location({ name: name });
    const locationJSON = { name: name };
    const result = location.toJSON();

    expect(result).toEqual(locationJSON);
  });

  test("fromJSON, valid", () => {
    const locationJSON = {
      name: "Underground House",
      type: "garett",
      description: "Here, by these rocks...",
      concentric: null,
      radial_hour: null,
      radial_minute: null,
    };
    const result = Location.fromJSON(locationJSON);
    const resultJSON = result.toJSON();

    expect(resultJSON).toEqual(locationJSON);
  });

  test("fromJSON, no type", () => {
    const locationJSON = { name: "Underground House" };
    const result = Location.fromJSON(locationJSON);
    const resultJSON = result.toJSON();

    expect(resultJSON).toEqual(locationJSON);
  });

  test("fromJSON, invalid", () => {
    const json = { type: "XYZZY" };
    expect(() => Location.fromJSON(json)).toThrow(
      `Invalid location JSON: ${JSON.stringify(json)}`
    );
  });

  test("JSON round-trip through text", () => {
    const location = new Location({
      name: "Log-Pile House",
      address: new RodGarettAddress({ description: "Here, by this lake..." }),
    });
    const locationJSON = location.toJSON();
    const locationJSONText = JSON.stringify(locationJSON);
    const result = Location.fromJSON(locationJSON);
    const resultJSONText = JSON.stringify(result.toJSON());

    expect(resultJSONText).toEqual(locationJSONText);
  });
});
