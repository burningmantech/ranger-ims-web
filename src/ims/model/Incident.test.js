import Event from "./Event";
import Incident from "./Incident";


describe("Incident", () => {

  test(
    "toString", () => {
      const event = new Event("1", "One");
      const number = 4;
      const incident = new Incident(event, number);

      const result = incident.toString();

      expect(result).toEqual(`#${number} (${event})`);
    }
  );

});
