import "@testing-library/jest-dom/extend-expect";
import { act, cleanup, screen } from "@testing-library/react";

import { DateTime } from "luxon";

import {
  renderWithIMSContext, testIncidentManagementSystem
} from "../ims/TestIMS";

import {
  formatArrayOfStrings,
  formatDateTime,
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

});


describe("DispatchQueue component", () => {

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
