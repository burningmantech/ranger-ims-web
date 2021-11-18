import "@testing-library/jest-dom/extend-expect";
import { act, screen } from "@testing-library/react";

import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";

import DispatchQueue from "./DispatchQueue";


describe("DispatchQueue component", () => {

  test(
    "loading incidents",
    async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMS(
            <DispatchQueue event={event} />, ims
          );
        });

        expect(screen.queryByText(`Loading...`)).toBeInTheDocument();
        break;
      }
    }
  );

  test(
    "incidents fail to load",
    async () => {
      const ims = testIncidentManagementSystem();

      ims.eventWithID = jest.fn(
        (id) => { throw new Error("because reasons..."); }
      );

      const spy = jest.spyOn(console, "error");

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithIMS(
            <DispatchQueue event={event} />, ims
          );

          expect(
            screen.queryByText("Error loading incidents")
          ).toBeInTheDocument();

          expect(spy).toHaveBeenCalledWith(
            "Unable to fetch incidents: because reasons..."
          );
        });
        break;
      }
    }
  );

  // test(
  //   "event name",
  //   async () => {
  //     const ims = testIncidentManagementSystem();

  //     for (const event of await ims.events()) {
  //       await act(async () => {
  //         renderWithIMS(
  //           <DispatchQueue event={event} />, ims
  //         );
  //       });

  //       expect(
  //         screen.queryByText(`Dispatch Queue: ${event.name}`)
  //       ).toBeInTheDocument();
  //     }
  //   }
  // );

});
