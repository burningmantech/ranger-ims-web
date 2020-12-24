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


const exampleStore = () => {
  return new Store(TEST_STORE_KEY, "Stuff 'N Things", StuffNThings);
}


describe("Store", () => {

  beforeEach(() => {
    if (window.localStorage.getItem(TEST_STORE_KEY) != null) {
      throw new Error("Found data container in local storage.");
    }
  });

  afterEach(() => {
    window.localStorage.removeItem(TEST_STORE_KEY);
  });

  test("initial state", () => {
    const store = exampleStore();

    expect(store.key).toEqual(TEST_STORE_KEY);
    expect(store.description).toEqual(TEST_STORE_DESCRIPTION);
    expect(store.modelClass).toEqual(StuffNThings);
  });

  test("store", () => {
    const store = exampleStore();
    const stuffNThings = new StuffNThings(TEST_STUFF, TEST_THINGS);

    store.store(stuffNThings);

    const jsonText = window.localStorage.getItem(TEST_STORE_KEY);
    expect(jsonText).toEqual(JSON.stringify({ data: stuffNThings.toJSON() }));
  });

  test("load, empty", () => {
    const store = exampleStore();

    expect(store.load().value).toBeNull();
  });

  test("load, valid", () => {
    const store = exampleStore();
    const stuffNThings = new StuffNThings(TEST_STUFF, TEST_THINGS);

    store.store(stuffNThings);

    const stuffNThingsFromStore = store.load().value;

    expect(
      JSON.stringify(stuffNThingsFromStore.toJSON())
    ).toEqual(JSON.stringify(stuffNThings.toJSON()));
  });

  test("load, invalid JSON", () => {
    window.localStorage.setItem(TEST_STORE_KEY, "*");

    const store = exampleStore();
    const spy = jest.spyOn(console, "error");

    const stuffNThings = store.load().value;

    expect(stuffNThings).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      "Unable to parse JSON container for Stuff 'N Things: " +
      "SyntaxError: Unexpected token * in JSON at position 0"
    );
  });

  test("load, missing data", () => {
    window.localStorage.setItem(TEST_STORE_KEY, "{}");

    const store = exampleStore();
    const spy = jest.spyOn(console, "error");

    const stuffNThings = store.load().value;

    expect(stuffNThings).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      "Stuff 'N Things found in cache, but has no data."
    );
  });

  test("load, invalid data", () => {
    window.localStorage.setItem(TEST_STORE_KEY, '{"data": {}}');

    const store = exampleStore();
    const spy = jest.spyOn(console, "error");

    const stuffNThings = store.load().value;

    expect(stuffNThings).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      "Invalid JSON for cached Stuff 'N Things: Error: stuff is required"
    );
  });

  test("remove", () => {
    const store = exampleStore();
    const stuffNThings = new StuffNThings(TEST_STUFF, TEST_THINGS);

    store.store(stuffNThings);
    store.remove();

    expect(store.load().value).toBe(null);
  });

});
