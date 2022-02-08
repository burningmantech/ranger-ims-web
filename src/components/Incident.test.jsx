import "@testing-library/jest-dom/extend-expect";
import { cleanup, screen } from "@testing-library/react";

import Incident from "./Incident";

import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";

describe("Incident component: loading", () => {
  test("title with event name", async () => {
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
});
