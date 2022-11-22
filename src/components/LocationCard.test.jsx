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
  const concentricStreets = new Map([
    ["1", new ConcentricStreet("1", "1st Street")],
    ["2", new ConcentricStreet("2", "2nd Street")],
  ]);
  const concentricStreetIDs = [null].concat(
    Array.from(concentricStreets.keys())
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

  test.each(randomSample(locations, 100))("selected values: %s", (location) => {
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

  test.each(cartesian(randomSample(locations, 100), randomSample(names, 4)))(
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

  test.each(
    cartesian(randomSample(locations, 100), randomSample(descriptions, 4))
  )("change description: %s -> %s", async (location, description) => {
    const setDescription = jest.fn();

    render(
      <LocationCard
        locationName={location.name}
        locationDescription={location.address.description}
        locationConcentric={location.address.concentric}
        locationRadialHour={location.address.radialHour}
        locationRadialMinute={location.address.radialMinute}
        concentricStreets={concentricStreets}
        setLocationName={throwError}
        setLocationDescription={setDescription}
        setLocationConcentric={throwError}
        setLocationRadialHour={throwError}
        setLocationRadialMinute={throwError}
      />
    );

    const textField = screen.getByLabelText("Description:");

    await userEvent.clear(textField);
    if (description) {
      await userEvent.type(textField, description);
    }

    if (
      (description || location.description) &&
      description != location.description
    ) {
      expect(setDescription).toHaveBeenCalledWith(
        description == null ? "" : description
      );
    }
  });

  test.each(
    cartesian(
      randomSample(locations, 100),
      randomSample(concentricStreetIDs, 4)
    )
  )(
    "change concentric street: %s -> %s",
    async (location, concentricStreetID) => {
      const setConcentricStreet = jest.fn();

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
          setLocationConcentric={setConcentricStreet}
          setLocationRadialHour={throwError}
          setLocationRadialMinute={throwError}
        />
      );

      const select = document.getElementById(
        "incident_location_address_concentric"
      );

      await userEvent.selectOptions(select, [
        concentricStreetID == null ? "" : concentricStreetID,
      ]);

      if (
        (concentricStreetID || location.address.concentric) &&
        concentricStreetID != location.address.concentric
      ) {
        expect(setConcentricStreet).toHaveBeenCalledWith(
          concentricStreetID == null ? "" : concentricStreetID
        );
      }
    }
  );

  test.each(cartesian(randomSample(locations, 100), randomSample(hours, 4)))(
    "change hour: %s -> %s",
    async (location, hour) => {
      const setHour = jest.fn();

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
          setLocationRadialHour={setHour}
          setLocationRadialMinute={throwError}
        />
      );

      const select = document.getElementById(
        "incident_location_address_radial_hour"
      );

      await userEvent.selectOptions(select, [
        hour == null ? "" : hour.toString(),
      ]);

      if (
        (hour || location.address.radialHour) &&
        hour != location.address.radialHour
      ) {
        expect(setHour).toHaveBeenCalledWith(hour == null ? "" : hour);
      }
    }
  );

  test.each(cartesian(randomSample(locations, 100), randomSample(minutes, 4)))(
    "change minute: %s -> %s",
    async (location, minute) => {
      const setMinute = jest.fn();

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
          setLocationRadialMinute={setMinute}
        />
      );

      const select = document.getElementById(
        "incident_location_address_radial_minute"
      );

      await userEvent.selectOptions(select, [
        minute == null ? "" : minute.toString(),
      ]);

      if (
        (minute || location.address.radialMinute) &&
        minute != location.address.radialMinute
      ) {
        expect(setMinute).toHaveBeenCalledWith(minute == null ? "" : minute);
      }
    }
  );
});
