import "@testing-library/jest-dom/extend-expect";
import { act, cleanup, screen } from "@testing-library/react";

import {
  renderWithIMSContext, testIncidentManagementSystem
} from "../ims/TestIMS";

import DispatchQueue from "./DispatchQueue";


describe("DispatchQueue component", () => {

  test(
    "loading incidents",
    async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        renderWithIMSContext(<DispatchQueue event={event} />, ims);

        expect(screen.queryByText(`Loading...`)).toBeInTheDocument();
        cleanup();
      }
    }
  );

  test(
    "incidents fail to load",
    async () => {
      const ims = testIncidentManagementSystem();

      ims.incidents = jest.fn(
        async (event) => { throw new Error("because reasons..."); }
      );

      const spy = jest.spyOn(console, "error");

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMSContext(<DispatchQueue event={event} />, ims);
        });

        expect(
          screen.queryByText("Error loading incidents")
        ).toBeInTheDocument();

        expect(spy).toHaveBeenCalledWith(
          "Unable to fetch incidents: because reasons..."
        );
        cleanup();
      }
    }
  );

  test(
    "title with event name",
    async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMSContext(
            <DispatchQueue event={event} />, ims
          );
        });

        expect(
          screen.queryByText(`Dispatch Queue: ${event.name}`)
        ).toBeInTheDocument();
      }
    }
  );

});
