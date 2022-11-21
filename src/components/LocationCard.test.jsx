import "@testing-library/jest-dom/extend-expect";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConcentricStreet from "../ims/model/ConcentricStreet";
import Location from "../ims/model/Location";
import RodGarettAddress from "../ims/model/RodGarettAddress";

import LocationCard from "./LocationCard";

describe("LocationCard component", () => {
  const names = [null, "", "Camp Whosit"];
  const descriptions = [null, "", "that one"];
  const hours = [null, 1, 12];
  const minutes = [null, 0, 55];
  const concentricStreets = [
    new ConcentricStreet("1", "1st Street"),
    new ConcentricStreet("2", "2nd Street"),
  ];
  const concentricStreetIDs = Array.from([null] + concentricStreets, (c) =>
    c == null ? null : c.id
  );

  const _locations = function* () {
    for (const name of names) {
      for (const description of descriptions) {
        for (const concentric of concentricStreetIDs) {
          for (const hour of hours) {
            for (const minute of minutes) {
              yield new Location({
                name: name,
                address: new RodGarettAddress({
                  description: description,
                  concentric: concentric,
                  radialHour: hour,
                  radialMinute: minute,
                }),
              });
            }
          }
        }
      }
    }
  };

  const locations = Array.from(_locations());

  test.each(randomSample(locations, 500))("selected values: %s", (location) => {
    render(
      <LocationCard
        locationName={location.name}
        locationDescription={location.address.description}
        locationConcentric={location.address.concentric}
        locationRadialHour={location.address.radialHour}
        locationRadialMinute={location.address.radialMinute}
        concentricStreets={concentricStreets}
        setLocationName={throwError}
        setLocationDescription={throwError}
        setLocationConcentric={throwError}
        setLocationRadialHour={throwError}
        setLocationRadialMinute={throwError}
      />
    );

    const toString = (value) => (value == null ? "" : value.toString());
    const valueForLabel = (label) => screen.getByLabelText(label + ":").value;
    const valueForID = (id) => document.getElementById(id).value;

    try {
      expect(valueForLabel("Name")).toEqual(toString(location.name));
      expect(valueForLabel("Description")).toEqual(
        toString(location.address.description)
      );

      expect(valueForID("incident_location_address_radial_hour")).toEqual(
        toString(location.address.radialHour)
      );
      expect(valueForID("incident_location_address_radial_minute")).toEqual(
        toString(location.address.radialMinute)
      );
      expect(valueForID("incident_location_address_concentric")).toEqual(
        toString(location.address.concentric)
      );
    } catch (e) {
      screen.debug();
      console.info(location);
      throw e;
    }
  });

  test.each(cartesian(randomSample(locations, 100), names))(
    "change name: %s -> %s",
    async (location, name) => {
      const setName = jest.fn();

      render(
        <LocationCard
          locationName={location.name}
          locationDescription={location.address.description}
          locationConcentric={location.address.concentric}
          locationRadialHour={location.address.radialHour}
          locationRadialMinute={location.address.radialMinute}
          concentricStreets={concentricStreets}
          setLocationName={setName}
          setLocationDescription={throwError}
          setLocationConcentric={throwError}
          setLocationRadialHour={throwError}
          setLocationRadialMinute={throwError}
        />
      );

      const textField = screen.getByLabelText("Name:");

      await userEvent.clear(textField);
      if (name) {
        await userEvent.type(textField, name);
      }

      if ((name || location.name) && name != location.name) {
        expect(setName).toHaveBeenCalledWith(name == null ? "" : name);
      }
    }
  );
});
