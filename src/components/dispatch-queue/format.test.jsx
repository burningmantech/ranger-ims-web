import { DateTime } from "luxon";

import {
  formatAddress,
  formatArrayOfStrings,
  formatDateTime,
  formatLocation,
  formatPriority,
  formatState,
} from "./format";
import {
  HighPriorityIcon,
  LowPriorityIcon,
  NormalPriorityIcon,
  UnknownPriorityIcon,
} from "../icons";

import Location from "../../ims/model/Location";
import RodGarettAddress from "../../ims/model/RodGarettAddress";

describe("Table cell formatting functions", () => {
  test("formatPriority, valid", () => {
    expect(formatPriority(1)).toEqual(<HighPriorityIcon />);
    expect(formatPriority(2)).toEqual(<HighPriorityIcon />);
    expect(formatPriority(3)).toEqual(<NormalPriorityIcon />);
    expect(formatPriority(4)).toEqual(<LowPriorityIcon />);
    expect(formatPriority(5)).toEqual(<LowPriorityIcon />);
  });

  test("formatPriority, invalid", () => {
    expect(formatPriority(-1)).toEqual(<UnknownPriorityIcon />);
    expect(formatPriority("XYZZY")).toEqual(<UnknownPriorityIcon />);
  });

  test("formatPriority, undefined", () => {
    expect(formatPriority()).toEqual(<UnknownPriorityIcon />);
  });

  test("formatDateTime, valid", () => {
    const dateTime = DateTime.fromISO("2021-08-17T17:12:46.720000Z");

    expect(formatDateTime(dateTime)).toEqual(
      dateTime.toFormat("ccc L/c HH:mm"),
    );
  });

  test("formatDateTime, undefined/null", () => {
    expect(formatDateTime(undefined)).toEqual("");
    expect(formatDateTime(null)).toEqual("");
  });

  test("formatState, valid", () => {
    expect(formatState("new")).toEqual("New");
    expect(formatState("on_hold")).toEqual("On Hold");
    expect(formatState("dispatched")).toEqual("Dispatched");
    expect(formatState("on_scene")).toEqual("On Scene");
    expect(formatState("closed")).toEqual("Closed");
  });

  test("formatState, invalid", () => {
    expect(formatState(-1)).toEqual(-1);
    expect(formatState("XYZZY")).toEqual("XYZZY");
  });

  test("formatState, undefined", () => {
    expect(formatState()).toBeUndefined();
  });

  test("formatAddress, all fields", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
      concentric: concentricStreetID,
      radialHour: 8,
      radialMinute: 37,
    });
    const text = formatAddress(address, concentricStreets);
    expect(text).toEqual(
      `${address.radialHour}:${address.radialMinute}@` +
        `${concentricStreetName} ` +
        `(${address.description})`,
    );
  });

  test("formatAddress, no description", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const address = new RodGarettAddress({
      concentric: concentricStreetID,
      radialHour: 8,
      radialMinute: 37,
    });
    const text = formatAddress(address, concentricStreets);
    expect(text).toEqual(
      `${address.radialHour}:${address.radialMinute}@` +
        `${concentricStreets.get(address.concentric)}`,
    );
  });

  test("formatAddress, no concentric", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
      radialHour: 8,
      radialMinute: 37,
    });
    const text = formatAddress(address, concentricStreets);
    expect(text).toEqual(
      `${address.radialHour}:${address.radialMinute}@- ` +
        `(${address.description})`,
    );
  });

  test("formatAddress, no radial hour", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
      concentric: concentricStreetID,
      radialMinute: 37,
    });
    const text = formatAddress(address, concentricStreets);
    expect(text).toEqual(
      `-:${address.radialMinute}@` +
        `${concentricStreetName} ` +
        `(${address.description})`,
    );
  });

  test("formatAddress, radial minute < 10", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
      concentric: concentricStreetID,
      radialHour: 8,
      radialMinute: 3,
    });
    const text = formatAddress(address, concentricStreets);
    expect(text).toEqual(
      `${address.radialHour}:0${address.radialMinute}@` +
        `${concentricStreetName} ` +
        `(${address.description})`,
    );
  });

  test("formatAddress, no radial minute", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
      concentric: concentricStreetID,
      radialHour: 8,
    });
    const text = formatAddress(address, concentricStreets);
    expect(text).toEqual(
      `${address.radialHour}:-@` +
        `${concentricStreetName} ` +
        `(${address.description})`,
    );
  });

  test("formatAddress, no coordinates", () => {
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
    });
    const text = formatAddress(address, new Map());
    expect(text).toEqual(`(${address.description})`);
  });

  test("formatAddress, no concentricStreets map", () => {
    const concentricStreetID = "0";
    const concentricStreets = null;
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
      concentric: concentricStreetID,
      radialHour: 8,
      radialMinute: 37,
    });
    const text = formatAddress(address, concentricStreets);
    expect(text).toEqual(
      `${address.radialHour}:${address.radialMinute}@- ` +
        `(${address.description})`,
    );
  });

  test("formatAddress, no fields", () => {
    const address = new RodGarettAddress({});
    expect(formatAddress(address, new Map())).toBeNull();
  });

  test("formatAddress, null", () => {
    expect(formatAddress(null)).toBeNull();
  });

  test("formatAddress, invalid", () => {
    expect(formatAddress(-1)).toBeNull();
    expect(formatAddress("XYZZY")).toBeNull();
  });

  test("formatAddress, undefined", () => {
    expect(formatAddress()).toBeUndefined();
  });

  test("formatLocation, all fields", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
      concentric: concentricStreetID,
      radialHour: 8,
      radialMinute: 37,
    });
    const location = new Location({
      name: "Treetop House",
      address,
    });
    const text = formatLocation(location, concentricStreets);
    expect(text).toEqual(
      `${location.name} @ ${formatAddress(address, concentricStreets)}`,
    );
  });

  test("formatLocation, no name", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
      concentric: "0",
      radialHour: 8,
      radialMinute: 37,
    });
    const location = new Location({ address });
    const text = formatLocation(location, concentricStreets);
    expect(text).toEqual(`${formatAddress(address, concentricStreets)}`);
  });

  test("formatLocation, no address", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const location = new Location({ name: "Treetop House" });
    const text = formatLocation(location, concentricStreets);
    expect(text).toEqual(`${location.name}`);
  });

  test("formatLocation, no fields", () => {
    const concentricStreetID = "0";
    const concentricStreetName = "Zero";
    const concentricStreets = new Map([
      [concentricStreetID, concentricStreetName],
    ]);
    const location = new Location({});
    const text = formatLocation(location, concentricStreets);
    expect(text).toBeNull();
  });

  test("formatLocation, null", () => {
    expect(formatLocation(null)).toBeNull();
  });

  test("formatLocation, invalid", () => {
    expect(formatLocation(-1)).toBeNull();
    expect(formatLocation("XYZZY")).toBeNull();
  });

  test("formatLocation, undefined", () => {
    expect(formatLocation()).toBeUndefined();
  });

  test("formatArrayOfStrings, empty", () => {
    expect(formatArrayOfStrings([])).toEqual("");
  });

  test("formatArrayOfStrings, one", () => {
    expect(formatArrayOfStrings(["one"])).toEqual("one");
  });

  test("formatArrayOfStrings, two", () => {
    expect(formatArrayOfStrings(["one", "two"])).toEqual("one, two");
  });

  test("formatArrayOfStrings, undefined", () => {
    expect(formatArrayOfStrings()).toEqual("");
  });
});
