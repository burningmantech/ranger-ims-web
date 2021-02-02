import { DateTime } from "luxon";


export default class Store {

  constructor(key, description, modelClass) {
    this.key = key;
    this.description = description;
    this.modelClass = modelClass;
    this._storage = window.localStorage;
  }

  store = (object, tag, lifespan) => {
    let value;
    if (this.modelClass == null) {
      value = object;
    }
    else if (object.constructor === Array) {
      value = object.map((element) => element.toJSON());
    }
    else {
      value = object.toJSON();
    }

    const expiration = (
      (lifespan == null) ? undefined: DateTime.local().plus(lifespan)
    );

    const container = { value: value, tag: tag, expiration: expiration };

    this._storage.setItem(this.key, JSON.stringify(container));
    console.debug(`Stored cached ${this.description} (tag:${tag}).`);
  }

  load = () => {
    const jsonText = this._storage.getItem(this.key);

    if (jsonText === null) {
      console.debug(`No ${this.description} found in local storage.`);
      return { value: null };
    }

    const error = (message) => {
      console.error(message);
      this.remove();
      return { value: null };
    }

    let container;
    try {
      container = JSON.parse(jsonText);
    }
    catch (e) {
      return error(
        `Unable to parse JSON container for ${this.description}: ${e}`
      );
    }

    const { value, tag } = container;

    if (value == null) {
      return error(`${this.description} found in cache, but has no value.`);
    }

    let object;
    try {
      if (this.modelClass == null) {
        object = value;
      }
      else if (value.constructor === Array) {
        object = value.map(
          (jsonObject) => this.modelClass.fromJSON(jsonObject)
        );
      }
      else {
        object = this.modelClass.fromJSON(value);
      }
    }
    catch (e) {
      return error(`Invalid JSON for cached ${this.description}: ${e}`);
    }

    console.debug(`Loaded cached ${this.description}.`);
    return { value: object, tag: tag };
  }

  remove = () => {
    this._storage.removeItem(this.key);
    console.debug(`Removed cached ${this.description}.`);
  }

}
