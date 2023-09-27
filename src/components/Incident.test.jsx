import { cleanup, screen } from "@testing-library/react";

import Incident from "./Incident";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";

describe("Incident component: display", () => {
  test("incident number", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(<Incident incident={incident} />, ims);

        expect(
          await screen.findByText(`Incident #${incident.number}`),
        ).toBeInTheDocument();

        cleanup();
      }
    }
  });

  test("incident state", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(<Incident incident={incident} />, ims);

        const select = screen.getByLabelText("State:");

        expect(select.value).toEqual(incident.state);

        cleanup();
      }
    }
  });

  test("incident priority", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(<Incident incident={incident} />, ims);

        const select = screen.getByLabelText("Priority:");

        expect(parseInt(select.value)).toEqual(incident.priority);

        cleanup();
      }
    }
  });

  test("incident summary", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(<Incident incident={incident} />, ims);

        const textField = screen.getByLabelText("Summary:");
        const expected = incident.summary == null ? "" : incident.summary;

        expect(textField.value).toEqual(expected);
        expect(textField.placeholder).toEqual("One-line summary of incident");

        cleanup();
      }
    }
  });

  test("location name", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(<Incident incident={incident} />, ims);

        const textField = screen.getByLabelText("Name:");
        const location = incident.location;
        const name = location == null ? null : location.name;

        expect(textField.value).toEqual(name == null ? "" : name);
        expect(textField.placeholder).toEqual(
          "Name of location (camp, art project, …)",
        );

        cleanup();
      }
    }
  });

  test("location radial street hour", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(<Incident incident={incident} />, ims);

        const select = document.getElementById(
          "incident_location_address_radial_hour",
        );
        const location = incident.location;
        const address = location == null ? null : location.address;
        const radialHour = address == null ? null : address.radialHour;

        expect(select.value).toEqual(
          radialHour == null ? "" : radialHour.toString(),
        );

        cleanup();
      }
    }
  });

  test("location radial street minute", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      for (const incident of await ims.incidents(event.id)) {
        renderWithIMSContext(<Incident incident={incident} />, ims);

        const select = document.getElementById(
          "incident_location_address_radial_minute",
        );
        const location = incident.location;
        const address = location == null ? null : location.address;
        const radialMinute = address == null ? null : address.radialMinute;

        expect(select.value).toEqual(
          radialMinute == null ? "" : radialMinute.toString(),
        );

        cleanup();
      }
    }
  });

  // test("location concentric street", async () => {
  //   const ims = testIncidentManagementSystem();

  //   for (const event of await ims.events()) {
  //     const concentricStreets = await ims.concentricStreets(event.id);

  //     for (const incident of await ims.incidents(event.id)) {
  //       renderWithIMSContext(<Incident incident={incident} />, ims);

  //       const select = document.getElementById(
  //         "incident_location_address_concentric"
  //       );
  //       const location = incident.location;
  //       const address = location == null ? null : location.address;
  //       const concentric = address == null ? null : address.concentric;
  //       const concentricStreet =
  //         concentric == null ? "" : concentricStreets.get(concentric);

  //       console.info(concentricStreet);
  //       expect(select.value).toEqual(concentricStreet == null ? "" : concentricStreet.id);

  //       cleanup();
  //     }
  //   }
  // });
});
