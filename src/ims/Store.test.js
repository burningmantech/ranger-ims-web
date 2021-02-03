import { DateTime } from "luxon";

import Store from "./Store";


const TEST_STORE_KEY = "stuff";
const TEST_STORE_DESCRIPTION = "Stuff 'N Things";
const TEST_STUFF = {
  a: 1,
  b: "two",
  c: { three: 3 },
  d: [ 5, 6, 7 ],
};
const TEST_THINGS = {
  x: "this is an X",
  y: "this is an Y",
  z: "this is an Z",
};


export default class StuffNThings {

  static fromJSON = (json) => {
    return new StuffNThings(json.stuff, json.things);
  }

  constructor(stuff, things) {
    if (stuff == null) {
      throw new Error("stuff is required");
    }

    this.stuff = stuff;
    this.things = things;
  }

  toJSON = () => {
    return { stuff: this.stuff, things: this.things };
  }

}


const jsonStore = () => {
  return new Store(TEST_STORE_KEY, "stuff-n-things");
}


const stuffNThingsStore = () => {
  return new Store(TEST_STORE_KEY, "Stuff 'N Things", StuffNThings);
}


describe("Store", () => {

  beforeEach(() => {
    if (window.localStorage.getItem(TEST_STORE_KEY) != null) {
      throw new Error("Found container in local storage.");
    }
  });

  afterEach(() => {
    window.localStorage.removeItem(TEST_STORE_KEY);
  });

  test("initial state", () => {
    const store = stuffNThingsStore();

    expect(store.key).toEqual(TEST_STORE_KEY);
    expect(store.description).toEqual(TEST_STORE_DESCRIPTION);
    expect(store.modelClass).toEqual(StuffNThings);
  });

  test("store JSON value", () => {
    const store = jsonStore();
    const value = { stuff: [1, 2, 3], things: "these" };

    store.store(value);

    const jsonText = window.localStorage.getItem(TEST_STORE_KEY);
    expect(jsonText).toEqual(JSON.stringify({ value: value }));
  });

  test("store model value", () => {
    const store = stuffNThingsStore();
    const stuffNThings = new StuffNThings(TEST_STUFF, TEST_THINGS);

    store.store(stuffNThings);

    const jsonText = window.localStorage.getItem(TEST_STORE_KEY);
    expect(jsonText).toEqual(JSON.stringify({ value: stuffNThings.toJSON() }));
  });

  test("store tag", () => {
    const store = jsonStore();
    const value = { stuff: [1, 2, 3], things: "these" };
    const tag = "FE7B2A95197A";

    store.store(value, tag);

    const jsonText = window.localStorage.getItem(TEST_STORE_KEY);
    expect(jsonText).toEqual(JSON.stringify({ value: value, tag: tag }));
  });

  test("store lifetime", () => {
    const store = jsonStore();
    const value = null;
    const lifetime = { seconds: 60 };
    const nowPlusLifetime = DateTime.local().plus({ seconds: 59 });

    store.store(null, undefined, lifetime);

    const jsonText = window.localStorage.getItem(TEST_STORE_KEY);
    const json = JSON.parse(jsonText);
    const expiration = DateTime.fromISO(json.expiration);

    // We computed expiration before and after the call, so the actual value
    // will be somewhere in between.
    expect(expiration).toBeAfterDateTime(nowPlusLifetime);
    expect(DateTime.local().plus({ seconds: 61 })).toBeAfterDateTime(
      expiration
    );

    // Test the entire container content for completeness
    expect(jsonText).toEqual(
      JSON.stringify({ value: null, expiration: json.expiration })
    );
  });

  test("load, empty", () => {
    const store = stuffNThingsStore();

    expect(store.load().value).toBeNull();
  });

  test("load JSON value", () => {
    const store = jsonStore();
    const value = { stuff: [1, 2, 3], things: "these" };

    store.store(value);

    const valueFromStore = store.load().value;

    expect(valueFromStore).toEqual(value);
  });

  test("load JSON array", () => {
    const store = jsonStore();
    const values = [ { stuff: [1, 2, 3], things: "these" }, "there" ];

    store.store(values);

    const valuesFromStore = store.load().value;

    expect(valuesFromStore).toEqual(values);
  });

  test("load model value", () => {
    const store = stuffNThingsStore();
    const stuffNThings = new StuffNThings(TEST_STUFF, TEST_THINGS);

    store.store(stuffNThings);

    const stuffNThingsFromStore = store.load().value;

    expect(
      JSON.stringify(stuffNThingsFromStore.toJSON())
    ).toEqual(JSON.stringify(stuffNThings.toJSON()));
  });

  test("load model array", () => {
    const store = stuffNThingsStore();
    const stuffNThingses = [
      new StuffNThings(TEST_STUFF, TEST_THINGS),
      new StuffNThings({}, {}),
    ]

    store.store(stuffNThingses);

    const stuffNThingsesFromStore = store.load().value;

    expect(
      stuffNThingsesFromStore.map((snt) => (JSON.stringify(snt.toJSON())))
    ).toEqual(
      stuffNThingses.map((snt) => (JSON.stringify(snt.toJSON())))
    );
  });

  test("load tag", () => {
    const store = stuffNThingsStore();
    const value = new StuffNThings(TEST_STUFF, TEST_THINGS);
    const tag = "FE7B2A95197A";

    store.store(value, tag);

    const container = store.load();

    expect(JSON.stringify(container)).toEqual(
      JSON.stringify({ value: value, tag: tag })
    );
  });

  test("load expiration", () => {
    const store = stuffNThingsStore();
    const lifetime = { seconds: 60 };
    const nowPlusLifetime = DateTime.local().plus({ seconds: 59 });

    store.store(null, undefined, lifetime);

    const container = store.load();
    const expiration = DateTime.fromISO(container.expiration);

    console.debug(`EXP: ${container.expiration}`);

    // We computed expiration before and after the call, so the actual value
    // will be somewhere in between.
    expect(expiration).toBeAfterDateTime(nowPlusLifetime);
    expect(DateTime.local().plus({ seconds: 61 })).toBeAfterDateTime(
      expiration
    );

    // Test the entire container content for completeness
    expect(JSON.stringify(container)).toEqual(
      JSON.stringify({ value: null, expiration: container.expiration })
    );
  });

  test("load, invalid JSON", () => {
    window.localStorage.setItem(TEST_STORE_KEY, "*");

    const store = stuffNThingsStore();
    const spy = jest.spyOn(console, "error");

    const stuffNThings = store.load().value;

    expect(stuffNThings).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      "Unable to parse JSON container for Stuff 'N Things: " +
      "SyntaxError: Unexpected token * in JSON at position 0"
    );
  });

  test("load, missing value", () => {
    window.localStorage.setItem(TEST_STORE_KEY, "{}");

    const store = stuffNThingsStore();
    const spy = jest.spyOn(console, "error");

    const stuffNThings = store.load().value;

    expect(stuffNThings).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      "Stuff 'N Things found in cache, but has no value."
    );
  });

  test("load, invalid value", () => {
    window.localStorage.setItem(TEST_STORE_KEY, '{"value": {}}');

    const store = stuffNThingsStore();
    const spy = jest.spyOn(console, "error");

    const stuffNThings = store.load().value;

    expect(stuffNThings).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      "Invalid JSON for cached Stuff 'N Things: Error: stuff is required"
    );
  });

  test("remove", () => {
    const store = stuffNThingsStore();
    const stuffNThings = new StuffNThings(TEST_STUFF, TEST_THINGS);

    store.store(stuffNThings);
    store.remove();

    expect(store.load().value).toBe(null);
  });

});
