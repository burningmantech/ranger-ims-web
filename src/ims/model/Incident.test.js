import Event from "./Event";
import Incident from "./Incident";


describe("Incident", () => {

  test(
    "toString", () => {
      const event = new Event("1", "One");
      const number = 1;
      const incident = new Incident(event, number);

      const eventJSON = { id: id, name: name };
      const result = event.toString();

      expect(result).toEqual(name);
    }
  );

});
