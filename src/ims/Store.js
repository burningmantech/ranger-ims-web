import { DateTime } from "luxon";

export default class Store {
  static _storage = window.localStorage;

  static removeAll = () => {
    Store._storage.clear();
    console.debug(`Removed all cached data.`);
  };

  constructor(modelClass, storeID) {
    this.modelClass = modelClass;
    this.storeID = storeID;
    this._storage = Store._storage;
  }

  serializeValue = (object) => {
    if (object == null) {
      // null
      return null;
    } else if (this.modelClass == null) {
      // JSON
      return object;
    } else if (object.constructor === Array) {
      // Array of model objects
      return object.map((element) => element.toJSON());
    } else {
      // Model object
      return object.toJSON();
    }
  };

  deserializeValue = (json) => {
    if (json == null) {
      // null
      return null;
    } else if (this.modelClass == null) {
      // JSON
      return json;
    } else if (json.constructor === Array) {
      // Array of model objects
      return json.map((jsonObject) => this.modelClass.fromJSON(jsonObject));
    } else {
      // Model object
      return this.modelClass.fromJSON(json);
    }
  };

  store = (object, tag, lifespan) => {
    const value = this.serializeValue(object);
    const expiration =
      lifespan == null ? undefined : DateTime.local().plus(lifespan);

    const container = { value: value, tag: tag, expiration: expiration };

    this._storage.setItem(this.storeID, JSON.stringify(container));
    console.debug(`Stored ${this.storeID} in cache (tag:${tag}).`);
  };

  load = () => {
    const jsonText = this._storage.getItem(this.storeID);

    if (jsonText === null) {
      console.debug(`No ${this.storeID} found in local storage.`);
      return { value: null };
    }

    const error = (message) => {
      console.warn(message);
      this.remove();
      return { value: null };
    };

    let container;
    try {
      container = JSON.parse(jsonText);
    } catch (e) {
      return error(`Unable to parse JSON container for ${this.storeID}: ${e}`);
    }

    const { value: valueJSON, tag, expiration: expirationJSON } = container;

    if (valueJSON === undefined) {
      return error(`${this.storeID} found in cache, but has no value.`);
    }

    let _value;
    try {
      _value = this.deserializeValue(valueJSON);
    } catch (e) {
      return error(`Invalid JSON for cached ${this.storeID}: ${e}`);
    }
    const value = _value;

    const expiration =
      expirationJSON == null ? undefined : DateTime.fromISO(expirationJSON);

    console.debug(`Loaded cached ${this.storeID}.`);
    return { value: value, tag: tag, expiration: expiration };
  };

  remove = () => {
    this._storage.removeItem(this.storeID);
    console.debug(`Removed cached ${this.storeID}.`);
  };
}
