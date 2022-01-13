import invariant from "invariant";


export default class Event {

  static fromJSON = (json) => {
    try {
      return new Event(json.id, json.name);
    }
    catch (e) {
      throw new Error(`Invalid event JSON: ${json}`)
    }
  }

  constructor(id, name) {
    invariant(id != null, "id is required");
    invariant(name != null, "name is required");

    this.id = id;
    this.name = name;
  }

  toString = () => {
    return this.name;
  }

  toJSON = () => {
    return { id: this.id, name: this.name };
  }

}
