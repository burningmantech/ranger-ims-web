import "@testing-library/jest-dom/extend-expect";
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
          await screen.findByText(`Incident #${incident.number}`)
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

        console.error(incident);

        expect(parseInt(select.value)).toEqual(incident.priority);

        cleanup();
      }
    }
  });
});
