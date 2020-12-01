import moment from "moment";

import IncidentManagementSystem from "./IMS";
import {
  TestIncidentManagementSystem, testIncidentManagementSystem, theBag
} from "./TestIMS";


describe("IMS", () => {

  test("bagURL", () => {
    const url = "https://localhost/ims/api/bag";
    const ims = new IncidentManagementSystem(url);

    expect(ims.bagURL).toEqual(url);
  });

  test("bagURL may not be undefined", () => {
    const message = "bagURL is required";

    expect(() => {new IncidentManagementSystem()}).toThrow(message);
  });

  test("bagURL may not be null", () => {
    const message = "bagURL is required";

    expect(() => {new IncidentManagementSystem(null)}).toThrow(message);
  });

  test("bagURL may not be empty string", () => {
    const message = "bagURL is required";

    expect(() => {new IncidentManagementSystem("")}).toThrow(message);
  });

  test("initial state", () => {
    const url = "https://localhost/ims/api/bag";
    const ims = new IncidentManagementSystem(url);

    expect(ims._bag).toBeNull();
  });

  test("load bag, check urls", async () => {
    const now = moment();
    const ims = testIncidentManagementSystem();

    const bag = await ims.bag();

    expect(bag).not.toBeUndefined();
    expect(bag.urls).not.toBeUndefined();

    for (const name in theBag.urls) {
      console.log(name);
      expect(bag.urls[name]).toEqual(theBag.urls[name]);
    }
  });

  test("load bag twice -> same bag", async () => {
    const ims = testIncidentManagementSystem();

    const bag1 = await ims.bag();
    const bag2 = await ims.bag();

    expect(bag2).toBe(bag1);
  });

});
