import RodGarettAddress from "./RodGarettAddress";


export default class Location {

  static fromJSON = (json) => {
    try {
      return new Location(
        {
          name: json.name,
          address: RodGarettAddress.fromJSON(json),
        }
      );
    }
    catch (e) {
      throw new Error(`Invalid location JSON: ${JSON.stringify(json)}`)
    }
  }

  constructor({name = null, address = null}) {
    this.name = name;
    this.address = address;
  }

  toString = () => {
    const name = (this.name == null) ? "(no name)" : this.name;
    const address = (
      (this.address == null) ? "(no address)" : `at ${this.address}`
    );
    return `${name} ${address}`;
  }

  toJSON = () => {
    const json = (this.address == null) ? {} : this.address.toJSON();
    json.name = this.name;
    return json;
  }

}
