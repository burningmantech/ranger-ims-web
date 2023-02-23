import RodGarettAddress from "./RodGarettAddress";

describe("RodGarettAddress", () => {
  test("toString, no fields", () => {
    const address = new RodGarettAddress({});
    const result = address.toString();

    expect(result).toEqual(`?:?@? ()`);
  });

  test("toString, text", () => {
    const description = "the deep dark wood";
    const address = new RodGarettAddress({ description: description });
    const result = address.toString();

    expect(result).toEqual(`?:?@? (${description})`);
  });

  test("toString, garett", () => {
    const description = "Here, by these rocks...";
    const concentric = "0";
    const radialHour = 9;
    const radialMinute = 0;
    const address = new RodGarettAddress({
      description: description,
      concentric: concentric,
      radialHour: radialHour,
      radialMinute: radialMinute,
    });
    const result = address.toString();

    expect(result).toEqual(
      `${radialHour}:${radialMinute}@${concentric} (${description})`,
    );
  });

  test("toJSON, no fields", () => {
    const address = new RodGarettAddress({});
    const addressJSON = {
      type: "garett",
      description: null,
      concentric: null,
      radial_hour: null,
      radial_minute: null,
    };
    const result = address.toJSON();

    expect(result).toEqual(addressJSON);
  });

  test("toJSON, not null", () => {
    const description = "Here, by this stream...";
    const concentric = "0";
    const radialHour = 8;
    const radialMinute = 37;
    const address = new RodGarettAddress({
      description: description,
      concentric: concentric,
      radialHour: radialHour,
      radialMinute: radialMinute,
    });
    const addressJSON = {
      type: "garett",
      description: description,
      concentric: concentric,
      radial_hour: radialHour,
      radial_minute: radialMinute,
    };
    const result = address.toJSON();

    expect(result).toEqual(addressJSON);
  });

  test("fromJSON, valid text", () => {
    const description = "Here, by this lake...";
    const addressJSONText = {
      type: "text",
      description: description,
    };
    const addressJSONGarett = {
      type: "garett",
      description: description,
      concentric: null,
      radial_hour: null,
      radial_minute: null,
    };
    const result = RodGarettAddress.fromJSON(addressJSONText);
    const resultJSON = result.toJSON();

    expect(resultJSON).toEqual(addressJSONGarett);
  });

  test("fromJSON, valid garett", () => {
    const description = "the grass ahead";
    const concentric = "1";
    const radialHour = 2;
    const radialMinute = 1;
    const addressJSON = {
      type: "garett",
      description: description,
      concentric: concentric,
      radial_hour: radialHour,
      radial_minute: radialMinute,
    };
    const result = RodGarettAddress.fromJSON(addressJSON);
    const resultJSON = result.toJSON();

    expect(resultJSON).toEqual(addressJSON);
  });

  test("fromJSON, invalid", () => {
    expect(() => RodGarettAddress.fromJSON({})).toThrow(
      `Invalid address JSON: {}`,
    );
  });

  test("JSON round-trip through text", () => {
    const description = "the trees ahead";
    const concentric = "7";
    const radialHour = 7;
    const radialMinute = 7;
    const address = new RodGarettAddress({
      description: description,
      concentric: concentric,
      radialHour: radialHour,
      radialMinute: radialMinute,
    });
    const addressJSON = address.toJSON();
    const addressJSONText = JSON.stringify(addressJSON);
    const result = RodGarettAddress.fromJSON(addressJSON);
    const resultJSONText = JSON.stringify(result.toJSON());

    expect(resultJSONText).toEqual(addressJSONText);
  });
});
