import { DateTime } from "luxon";


export default class Store {

  constructor(key, description, modelClass) {
    this.key = key;
    this.description = description;
    this.modelClass = modelClass;
    this._storage = window.localStorage;
  }

  store = (object, tag, lifespan) => {
    let dataJSON;
    if (this.modelClass == null) {
      dataJSON = object;
    }
    else if (object.constructor === Array) {
      dataJSON = object.map((element) => element.toJSON());
    }
    else {
      dataJSON = object.toJSON();
    }

    const expiration = (
      (lifespan == null) ? undefined: DateTime.local().plus(lifespan)
    );

    const container = { value: dataJSON, tag: tag, expiration: expiration };

    this._storage.setItem(this.key, JSON.stringify(container));
    console.debug(`Stored cached ${this.description} (tag:${tag}).`);
  }

  load = () => {
    const jsonText = this._storage.getItem(this.key);

    if (jsonText === null) {
      console.debug(`No ${this.description} found in local storage.`);
      return { value: null, tag: null };
    }

    const error = (message) => {
      console.error(message);
      this.remove();
      return { value: null, tag: null };
    }

    let containerJSON;
    try {
      containerJSON = JSON.parse(jsonText);
    }
    catch (e) {
      return error(
        `Unable to parse JSON container for ${this.description}: ${e}`
      );
    }

    const dataJSON = containerJSON.value;
    if (dataJSON == null) {
      return error(`${this.description} found in cache, but has no value.`);
    }

    let object;
    try {
      if (this.modelClass == null) {
        object = dataJSON;
      }
      else if (dataJSON.constructor === Array) {
        object = dataJSON.map(
          (jsonObject) => this.modelClass.fromJSON(jsonObject)
        );
      }
      else {
        object = this.modelClass.fromJSON(dataJSON);
      }
    }
    catch (e) {
      return error(`Invalid JSON for cached ${this.description}: ${e}`);
    }

    console.debug(`Loaded cached ${this.description}.`);
    return { value: object, tag: null };
  }

  remove = () => {
    this._storage.removeItem(this.key);
    console.debug(`Removed cached ${this.description}.`);
  }

}
