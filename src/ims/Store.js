export default class Store {

  constructor(key, description, modelClass) {
    this.key = key;
    this.description = description;
    this.modelClass = modelClass;
    this._storage = window.localStorage;
  }

  store = (object, expiration) => {
    let dataJSON;
    if (object.constructor === Array) {
      dataJSON = object.map((element) => element.toJSON());
    }
    else {
      dataJSON = object.toJSON();
    }

    const container = { data: dataJSON, expiration: expiration };

    this._storage.setItem(this.key, JSON.stringify(container));
  }

  load = () => {
    const jsonText = this._storage.getItem(this.key);

    if (jsonText === null) {
      console.debug(`No ${this.description} found in local storage.`);
      return null;
    }

    let containerJSON;
    try {
      containerJSON = JSON.parse(jsonText);
    }
    catch (e) {
      console.error(
        `Unable to parse JSON container for ${this.description}: ${e}`
      );
      this.remove();
      return null;
    }

    const dataJSON = containerJSON.data;
    if (dataJSON == null) {
      console.error(`${this.description} found in cache, but has no data.`);
      this.remove();
      return null;
    }

    let object;
    try {
      if (dataJSON.constructor === Array) {
        object = dataJSON.map(
          (jsonObject) => this.modelClass.fromJSON(jsonObject)
        );
      }
      else {
        object = this.modelClass.fromJSON(dataJSON);
      }
    }
    catch (e) {
      console.error(`Invalid JSON for cached ${this.description}: ${e}`);
      this.remove();
      return null;
    }

    console.log(`Loaded cached ${this.description}.`);
    return object;
  }

  remove = () => {
    this._storage.removeItem(this.key);
    console.debug(`Removed cached ${this.description}.`);
  }

}
