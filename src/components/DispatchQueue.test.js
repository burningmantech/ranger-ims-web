import invariant from "invariant";
import "@testing-library/jest-dom/extend-expect";
import { act, cleanup, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import { DateTime } from "luxon";

import {
  renderWithIMSContext, testIncidentManagementSystem
} from "../ims/TestIMS";
import Location from "../ims/model/Location";
import RodGarettAddress from "../ims/model/RodGarettAddress";

import {
  defaultPageSize,
  formatAddress,
  formatArrayOfStrings,
  formatDateTime,
  formatLocation,
  formatPriority,
  formatShowDays,
  formatShowState,
  formatState,
  HighPriorityIcon,
  LowPriorityIcon,
  NormalPriorityIcon,
  UnknownPriorityIcon,
} from "./DispatchQueue";
import DispatchQueue from "./DispatchQueue";


describe("Table cell formatting functions", () => {

  test(
    "formatPriority, valid",
    () => {
      expect(formatPriority({value: 1})).toEqual(<HighPriorityIcon />);
      expect(formatPriority({value: 2})).toEqual(<HighPriorityIcon />);
      expect(formatPriority({value: 3})).toEqual(<NormalPriorityIcon />);
      expect(formatPriority({value: 4})).toEqual(<LowPriorityIcon />);
      expect(formatPriority({value: 5})).toEqual(<LowPriorityIcon />);
    }
  );

  test(
    "formatPriority, invalid",
    () => {
      expect(formatPriority({value: -1})).toEqual(<UnknownPriorityIcon />);
      expect(formatPriority({value: "XYZZY"})).toEqual(<UnknownPriorityIcon />);
    }
  );

  test(
    "formatPriority, undefined",
    () => {
      expect(formatPriority({})).toEqual(<UnknownPriorityIcon />);
    }
  );

  test(
    "formatDateTime, valid",
    () => {
      const dateTime = DateTime.fromISO("2021-08-17T17:12:46.720000+00:00");

      expect(
        formatDateTime({value: dateTime})
      ).toEqual(dateTime.toFormat("ccc L/c HH:mm"));
    }
  );

  test(
    "formatDateTime, undefined/null",
    () => {
      expect(formatDateTime({value: undefined})).toEqual("");
      expect(formatDateTime({value: null})).toEqual("");
    }
  );

  test(
    "formatState, valid",
    () => {
      expect(formatState({value: "new"})).toEqual("New");
      expect(formatState({value: "on_hold"})).toEqual("On Hold");
      expect(formatState({value: "dispatched"})).toEqual("Dispatched");
      expect(formatState({value: "on_scene"})).toEqual("On Scene");
      expect(formatState({value: "closed"})).toEqual("Closed");
    }
  );

  test(
    "formatState, invalid",
    () => {
      expect(formatState({value: -1})).toEqual(-1);
      expect(formatState({value: "XYZZY"})).toEqual("XYZZY");
    }
  );

  test(
    "formatState, undefined",
    () => {
      expect(formatState({})).toBeUndefined();
    }
  );

  test(
    "formatAddress, all fields",
    () => {
      const address = new RodGarettAddress({
        description: "Here, by this stream...",
        concentric: "0",
        radialHour: 8,
        radialMinute: 37,
      });
      const text = formatAddress({value: address});
      expect(text).toEqual(
        `${address.concentric}@` +
        `${address.radialHour}:${address.radialMinute} ` +
        `(${address.description})`
      );
    }
  );

  test(
    "formatAddress, no description",
    () => {
      const address = new RodGarettAddress({
        concentric: "0",
        radialHour: 8,
        radialMinute: 37,
      });
      const text = formatAddress({value: address});
      expect(text).toEqual(
        `${address.concentric}@` +
        `${address.radialHour}:${address.radialMinute}`
      );
    }
  );


  test(
    "formatAddress, no concentric",
    () => {
      const address = new RodGarettAddress({
        description: "Here, by this stream...",
        radialHour: 8,
        radialMinute: 37,
      });
      const text = formatAddress({value: address});
      expect(text).toEqual(
        `@${address.radialHour}:${address.radialMinute} ` +
        `(${address.description})`
      );
    }
  );

  test(
    "formatAddress, no radial hour",
    () => {
      const address = new RodGarettAddress({
        description: "Here, by this stream...",
        concentric: "0",
        radialMinute: 37,
      });
      const text = formatAddress({value: address});
      expect(text).toEqual(
        `${address.concentric}@:${address.radialMinute} ` +
        `(${address.description})`
      );
    }
  );

  test(
    "formatAddress, no radial minute",
    () => {
      const address = new RodGarettAddress({
        description: "Here, by this stream...",
        concentric: "0",
        radialHour: 8,
      });
      const text = formatAddress({value: address});
      expect(text).toEqual(
        `${address.concentric}@${address.radialHour}: ` +
        `(${address.description})`
      );
    }
  );

  test(
    "formatAddress, no coordinates",
    () => {
      const address = new RodGarettAddress({
        description: "Here, by this stream...",
      });
      const text = formatAddress({value: address});
      expect(text).toEqual(`(${address.description})`);
    }
  );

  test(
    "formatAddress, no fields",
    () => {
      const address = new RodGarettAddress({});
      expect(formatAddress({value: address})).toBeNull();
    }
  );

  test(
    "formatAddress, null",
    () => {
      expect(formatAddress({value: null})).toBeNull();
    }
  );

  test(
    "formatAddress, invalid",
    () => {
      expect(formatAddress({value: -1})).toBeNull();
      expect(formatAddress({value: "XYZZY"})).toBeNull();
    }
  );

  test(
    "formatAddress, undefined",
    () => {
      expect(formatAddress({})).toBeUndefined();
    }
  );



  test(
    "formatLocation, all fields",
    () => {
      const address = new RodGarettAddress({
        description: "Here, by this stream...",
        concentric: "0",
        radialHour: 8,
        radialMinute: 37,
      });
      const location = new Location({
        name: "Treetop House",
        address: address,
      });
      const text = formatLocation({value: location});
      expect(text).toEqual(
        `${location.name} @ ${formatAddress({value: address})}`
      );
    }
  );

  test(
    "formatLocation, no name",
    () => {
      const address = new RodGarettAddress({
        description: "Here, by this stream...",
        concentric: "0",
        radialHour: 8,
        radialMinute: 37,
      });
      const location = new Location({address: address});
      const text = formatLocation({value: location});
      expect(text).toEqual(
        `${formatAddress({value: address})}`
      );
    }
  );

  test(
    "formatLocation, no address",
    () => {
      const location = new Location({name: "Treetop House"});
      const text = formatLocation({value: location});
      expect(text).toEqual(`${location.name}`);
    }
  );

  test(
    "formatLocation, no fields",
    () => {
      const location = new Location({});
      const text = formatLocation({value: location});
      expect(text).toBeNull();
    }
  );

  test(
    "formatLocation, null",
    () => {
      expect(formatLocation({value: null})).toBeNull();
    }
  );

  test(
    "formatLocation, invalid",
    () => {
      expect(formatLocation({value: -1})).toBeNull();
      expect(formatLocation({value: "XYZZY"})).toBeNull();
    }
  );

  test(
    "formatLocation, undefined",
    () => {
      expect(formatLocation({})).toBeUndefined();
    }
  );

  test(
    "formatArrayOfStrings, empty",
    () => {
      expect(formatArrayOfStrings({value: []})).toEqual("");
    }
  );

  test(
    "formatArrayOfStrings, one",
    () => {
      expect(formatArrayOfStrings({value: ["one"]})).toEqual("one");
    }
  );

  test(
    "formatArrayOfStrings, two",
    () => {
      expect(formatArrayOfStrings({value: ["one", "two"]})).toEqual("one, two");
    }
  );

  test(
    "formatArrayOfStrings, undefined",
    () => {
      expect(formatArrayOfStrings({})).toEqual("");
    }
  );

});


describe("DispatchQueue component: table", () => {

  test(
    "displayed incidents are valid up to page size",
    async () => {
      // Test with 0, 10, 20, ... 200 incidents in the system
      for (const incidentCount of [0, 10, 44, 50, 201, defaultPageSize]) {
        const ims = testIncidentManagementSystem();
        const event = await ims.eventWithID("empty");

        await ims.addMoreIncidents(event.id, incidentCount);

        const incidents = await ims.incidents(event.id);
        invariant(
          incidents.length == incidentCount,
          `Failed to add incidents (${incidents.length} != ${incidentCount})`
        );

        await act(async () => {
          renderWithIMSContext(<DispatchQueue event={event} />, ims);
        });

        const numberCells = document.getElementsByClassName(
          "queue_incident_number"
        );

        expect(numberCells.length).toEqual(
          (incidents.length > defaultPageSize)
          ? defaultPageSize : incidents.length
        );

        for (const numberCell of numberCells) {
          const incidentNumber = parseInt(numberCell.innerHTML);
          expect(
            () => ims.incidentWithNumber(event.id, incidentNumber)
          ).not.toThrow();
        }

        ims.flushCaches();  // Reset IMS state
        cleanup();  // Reset React state
      }
    }
  );

});


describe("DispatchQueue component: controls", () => {

  test(
    "formatShowState, valid",
    () => {
      expect(formatShowState("all")).toEqual("All");
      expect(formatShowState("open")).toEqual("Open");
      expect(formatShowState("active")).toEqual("Active");
    }
  );

  test(
    "formatShowState, invalid",
    () => {
      expect(
        () => formatShowState(-1)
      ).toThrow("Invalid show state: -1");
      expect(
        () => formatShowState("XYZZY")
      ).toThrow('Invalid show state: "XYZZY"');
    }
  );

  test(
    "formatShowDays, valid",
    () => {
      expect(formatShowDays(0)).toEqual("All Days");
      expect(formatShowDays(1)).toEqual("Last Day");
      expect(formatShowDays(2)).toEqual("Last 2 Days");
      expect(formatShowDays(3)).toEqual("Last 3 Days");
      expect(formatShowDays(4)).toEqual("Last 4 Days");
    }
  );

  // test(
  //   "new incident",
  //   async () => {

  //   }
  // );

  // test(
  //   "show state",
  //   async () => {

  //   }
  // );

  // test(
  //   "show days",
  //   async () => {

  //   }
  // );

  test(
    "show rows selection",
    async () => {
      for (const incidentCount of [0, 10, 100, 200, defaultPageSize]) {
        const ims = testIncidentManagementSystem();
        const event = await ims.eventWithID("empty");

        await ims.addMoreIncidents(event.id, incidentCount);

        for (const multiple of [0,1,2,4]) {
          await act(async () => {
            renderWithIMSContext(<DispatchQueue event={event} />, ims);
          });

          const dropdown = document.getElementById("queue_show_rows_dropdown");
          await act(async () => {
            userEvent.click(dropdown);
          });

          const selectorID = `queue_show_rows_${multiple}`;
          const selector = document.getElementById(selectorID);
          await act(async () => {
            userEvent.click(selector);
          });

          // Ensure the selection is displays in the dropdown
          const numberofIncidentsToDisplay = (
            (multiple === 0) ? incidentCount : multiple * defaultPageSize
          );
          const selectorCount = (
            (multiple === 0 || numberofIncidentsToDisplay === incidentCount)
            ? "All" : `${numberofIncidentsToDisplay}`
          );
          expect(dropdown.innerHTML).toEqual(`Show ${selectorCount} Rows`);

          // Ensure the correct number of rows are displayed
          const numberCells = document.getElementsByClassName(
            "queue_incident_number"
          );
          expect(numberCells.length).toEqual(
            incidentCount > numberofIncidentsToDisplay
            ? numberofIncidentsToDisplay : incidentCount
          );

          cleanup();  // Reset React state
        }
        ims.flushCaches();  // Reset IMS state
      }
    }
  );

  // test(
  //   "search",
  //   async () => {

  //   }
  // );

  // test(
  //   "pagination",
  //   async () => {

  //   }
  // );

});


describe("DispatchQueue component: loading", () => {

  test(
    "loading incidents",
    async () => {
      const ims = testIncidentManagementSystem();

      for (const event of await ims.events()) {
        renderWithIMSContext(<DispatchQueue event={event} />, ims);

        expect(screen.queryByText("Loading...")).toBeInTheDocument();
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
        renderWithIMSContext(<DispatchQueue event={event} />, ims);

        expect(
          await screen.findByText("Error loading incidents")
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
        renderWithIMSContext(
          <DispatchQueue event={event} />, ims
        );

        expect(
          await screen.findByText(`Dispatch Queue: ${event.name}`)
        ).toBeInTheDocument();
      }
    }
  );

});
