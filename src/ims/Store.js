import { DateTime } from "luxon";


export default class Store {

  constructor(key, description, modelClass) {
    this.key = key;
    this.description = description;
    this.modelClass = modelClass;
    this._storage = window.localStorage;
  }

  serializeValue = (object) => {
    if (object == null) {
      // null
      return null;
    }
    else if (this.modelClass == null) {
      // JSON
      return object;
    }
    else if (object.constructor === Array) {
      // Array of model objects
      return object.map((element) => element.toJSON());
    }
    else {
      // Model object
      return object.toJSON();
    }
  }

  deserializeValue = (json) => {
    if (json == null) {
      // null
      return null;
    }
    else if (this.modelClass == null) {
      // JSON
      return json;
    }
    else if (json.constructor === Array) {
      // Array of model objects
      return json.map(
        (jsonObject) => this.modelClass.fromJSON(jsonObject)
      );
    }
    else {
      // Model object
      return this.modelClass.fromJSON(json);
    }
  }

  store = (object, tag, lifespan) => {
    let value;
    if (object == null) {
      value = null;
    }
    else if (this.modelClass == null) {
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

    const { value: valueJSON, tag, expiration: expirationJSON } = container;

    if (valueJSON === undefined) {
      return error(`${this.description} found in cache, but has no value.`);
    }

    let _value;
    try {
      _value = this.deserializeValue(valueJSON);
    }
    catch (e) {
      return error(`Invalid JSON for cached ${this.description}: ${e}`);
    }
    const value = _value;

    const expiration = (
      (expirationJSON == null) ? undefined : DateTime.fromISO(expirationJSON)
    );

    console.debug(`Loaded cached ${this.description}.`);
    return { value: value, tag: tag, expiration: expiration };
  }

  remove = () => {
    this._storage.removeItem(this.key);
    console.debug(`Removed cached ${this.description}.`);
  }

}
