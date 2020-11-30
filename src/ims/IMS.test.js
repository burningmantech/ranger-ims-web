import IncidentManagementSystem from "./IMS";


function testIncidentManagementSystem() {
  const url = "/ims/api/bag";
  return new IncidentManagementSystem(url);
}


describe("IMS", () => {

  test("bagURL", () => {
    const url = "/ims/api/bag";
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
    const ims = testIncidentManagementSystem();

    expect(ims._bag).toBeNull();
  });

  test("load bag -> valid expiration", async () => {
    const now = moment();
    const ims = testIncidentManagementSystem();

    bag = await(ims._bag());

    expect(bag.expiration).not.toBeUndefined();
    expect(bag.expiration).toBeAfterMoment(now);
  });

  test("load bag twice -> same bag", async () => {
    const ims = testIncidentManagementSystem();

    bag1 = await(ims._bag());
    bag2 = await(ims._bag());

    expect(bag2).toBe(bag1);
  });

});
