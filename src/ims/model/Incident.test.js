import Event from "./Event";
import Incident from "./Incident";


describe("Incident", () => {

  test(
    "toString", () => {
      const eventID = "1";
      const number = 4;
      const incident = new Incident(eventID, number);

      const result = incident.toString();

      expect(result).toEqual(`#${number} (${eventID})`);
    }
  );

  test(
    "toJSON", () => {
      const eventID = "1";
      const number = 4;
      const incident = new Incident(eventID, number);

      const result = incident.toJSON();

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify(
          {
            "event": "1",
            "number": 4,
          }
        )
      );
    }
  );

});
