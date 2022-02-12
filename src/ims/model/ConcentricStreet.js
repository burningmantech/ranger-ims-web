import invariant from "invariant";

export default class ConcentricStreet {
  static fromJSON = (json) => {
    try {
      return new ConcentricStreet(json.id, json.name);
    } catch (e) {
      throw new Error(
        `Invalid concentric street JSON: ${JSON.stringify(json)}`
      );
    }
  };

  constructor(id, name) {
    invariant(id != null, "id is required");
    invariant(name != null, "name is required");

    this.id = id;
    this.name = name;
  }

  toString = () => {
    return this.name;
  };

  toJSON = () => {
    return { id: this.id, name: this.name };
  };
}
