import "@testing-library/jest-dom/extend-expect";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConcentricStreet from "../ims/model/ConcentricStreet";
import Location from "../ims/model/Location";
import RodGarettAddress from "../ims/model/RodGarettAddress";

import LocationCard from "./LocationCard";

const _concentricStreets = function* () {
  yield new ConcentricStreet("1", "1st Street");
  yield new ConcentricStreet("2", "2nd Street");
  yield new ConcentricStreet("3", "3rd Street");
};

const concentricStreets = Array.from(_concentricStreets());

const _locations = function* () {
  for (const name of [null, "", "Camp Whosit"]) {
    for (const description of [null, "", "that one"]) {
      for (const concentric of [null].concat(
        Array.from(concentricStreets, (c) => c.id)
      )) {
        for (const hour of [null, 1, 12]) {
          for (const minute of [null, 0, 55]) {
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

describe("LocationCard component", () => {
  test.each(locations)("selected values: %s", async (location) => {
    render(
      <LocationCard
        locationName={location.name}
        locationDescription={location.address.description}
        locationConcentric={location.address.concentric}
        locationRadialHour={location.address.radialHour}
        locationRadialMinute={location.address.radialMinute}
        concentricStreets={concentricStreets}
        setLocationName={(v) => {}}
        setLocationDescription={(v) => {}}
        setLocationConcentric={(v) => {}}
        setLocationRadialHour={(v) => {}}
        setLocationRadialMinute={(v) => {}}
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

  // const test_setValue = async (value, values, nextValue) => {
  //   const setValue = jest.fn();

  //   render(
  //     <LocationCard
  //       id="id"
  //       label="label"
  //       value={value}
  //       setValue={setValue}
  //       values={values.map((v) => [v, v])}
  //     />
  //   );

  //   const select = screen.getByLabelText("label:");

  //   await userEvent.selectOptions(select, [nextValue]);

  //   expect(setValue).toHaveBeenCalledTimes(1);
  //   expect(setValue).toHaveBeenCalledWith(nextValue);
  // };

  // {
  //   const values = ["1", "2", "3", "4"];
  //   for (const value of values) {
  //     for (const nextValue of values) {
  //       test(`onChange callback (${value}, ${nextValue})`, async () => {
  //         await test_setValue(value, values, nextValue);
  //       });
  //     }
  //   }
  // }
});
