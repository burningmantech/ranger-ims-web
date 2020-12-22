export default class Event {

  static fromJSON = (json) => {
    return new Event(json.id, json.name);
  }

  constructor(id, name) {
    if (id == null) {
      throw new Error("id is required");
    }
    if (name == null) {
      throw new Error("name is required");
    }

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
