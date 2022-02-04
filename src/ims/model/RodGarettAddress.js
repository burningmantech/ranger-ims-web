export default class RodGarettAddress {
  static fromJSON = (json) => {
    try {
      if (json.type === "text") {
        return new RodGarettAddress({
          description: json.description,
          concentric: null,
          radialHour: null,
          radialMinute: null,
        });
      } else if (json.type === "garett") {
        return new RodGarettAddress({
          description: json.description,
          concentric: json.concentric,
          radialHour: json.radial_hour,
          radialMinute: json.radial_minute,
        });
      } else {
        throw new Error("Unknown address type");
      }
    } catch (e) {
      throw new Error(`Invalid address JSON: ${JSON.stringify(json)}`);
    }
  };

  constructor({
    description = null,
    concentric = null,
    radialHour = null,
    radialMinute = null,
  }) {
    this.description = description; // text description
    this.concentric = concentric; // text ID for road
    this.radialHour = radialHour; // integer 1-12
    this.radialMinute = radialMinute; // integer 0-59
  }

  toString = () => {
    const formatNull = (value, alternate) => {
      return value == null ? alternate : value;
    };
    return (
      `${formatNull(this.concentric, "?")}@` +
      `${formatNull(this.radialHour, "?")}:` +
      `${formatNull(this.radialMinute, "?")} ` +
      `(${formatNull(this.description, "")})`
    );
  };

  toJSON = () => {
    return {
      type: "garett",
      description: this.description,
      concentric: this.concentric,
      radial_hour: this.radialHour,
      radial_minute: this.radialMinute,
    };
  };
}
