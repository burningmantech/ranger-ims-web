import IncidentManagementSystem from "./IMS";


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

});
