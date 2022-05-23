import invariant from "invariant";
import "@testing-library/jest-dom/extend-expect";
import { act, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DateTime } from "luxon";

import { URLs } from "../URLs";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
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

export const waitForIncidents = async () => {
  await waitForElementToBeRemoved(() => screen.getByText("Loading…"));
};

export const waitForEffects = async () => {
  await waitForIncidents();
};

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
      dateTime.toFormat("ccc L/c HH:mm")
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
        `(${address.description})`
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
        `${concentricStreets.get(address.concentric)}`
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
        `(${address.description})`
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
        `(${address.description})`
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
        `(${address.description})`
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
        `(${address.description})`
    );
  });

  test("formatAddress, no coordinates", () => {
    const address = new RodGarettAddress({
      description: "Here, by this stream...",
    });
    const text = formatAddress(address, new Map());
    expect(text).toEqual(`(${address.description})`);
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
      address: address,
    });
    const text = formatLocation(location, concentricStreets);
    expect(text).toEqual(
      `${location.name} @ ${formatAddress(address, concentricStreets)}`
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
    const location = new Location({ address: address });
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

describe("DispatchQueue component: table", () => {
  const test_displayedValidUpToPageSize = async (incidentCount) => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    await ims.addMoreIncidents(event.id, incidentCount);

    // Make sure addMoreIncidents worked
    const incidents = await ims.incidents(event.id);
    invariant(
      incidents.length == incidentCount,
      `Failed to add incidents (${incidents.length} != ${incidentCount})`
    );

    renderWithIMSContext(<DispatchQueue event={event} />, ims);

    await waitForEffects();

    const numberCells = document.getElementsByClassName(
      "queue_incident_number"
    );

    expect(numberCells.length).toEqual(
      incidents.length > defaultPageSize ? defaultPageSize : incidents.length
    );

    for (const numberCell of numberCells) {
      const incidentNumber = parseInt(numberCell.innerHTML);
      expect(() =>
        ims.incidentWithNumber(event.id, incidentNumber)
      ).not.toThrow();
    }
  };

  // Test with 0, 10, 20, ... 200 incidents in the system
  for (const incidentCount of [0, 10, 44, 50, 201, defaultPageSize]) {
    test("displayed incidents are valid up to page size (${incidentCount})", async () => {
      await test_displayedValidUpToPageSize(incidentCount);
    });
  }

  test("click row -> open incident in new tab", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");
    const incidentCount = defaultPageSize;

    await ims.addMoreIncidents(event.id, incidentCount);

    renderWithIMSContext(<DispatchQueue event={event} />, ims);

    await waitForEffects();

    for (const row of document.getElementsByClassName("queue_incident_row")) {
      const numberCell = row.querySelector(".queue_incident_number");
      const incidentNumber = parseInt(numberCell.innerHTML);

      for (const cell of row.getElementsByTagName("td")) {
        const url = URLs.incident(event.id, incidentNumber);
        const context = `${event.id}:${incidentNumber}`;

        window.open = jest.fn();
        await act(async () => {
          await userEvent.click(cell);
        });

        expect(window.open).toHaveBeenCalledWith(url, context);
      }
    }
  });
});

describe("DispatchQueue component: controls", () => {
  test("formatShowState, valid", () => {
    expect(formatShowState("all")).toEqual("All");
    expect(formatShowState("open")).toEqual("Open");
    expect(formatShowState("active")).toEqual("Active");
  });

  test("formatShowState, invalid", () => {
    expect(() => formatShowState(-1)).toThrow("Invalid show state: -1");
    expect(() => formatShowState("XYZZY")).toThrow(
      'Invalid show state: "XYZZY"'
    );
  });

  test("formatShowDays, valid", () => {
    expect(formatShowDays(0)).toEqual("All Days");
    expect(formatShowDays(1)).toEqual("Last Day");
    expect(formatShowDays(2)).toEqual("Last 2 Days");
    expect(formatShowDays(3)).toEqual("Last 3 Days");
    expect(formatShowDays(4)).toEqual("Last 4 Days");
  });

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

  const test_showRowsSelection = async (incidentCount, multiple) => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    await ims.addMoreIncidents(event.id, incidentCount);

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
    const numberofIncidentsToDisplay =
      multiple === 0 ? incidentCount : multiple * defaultPageSize;
    const selectorCount =
      multiple === 0 || numberofIncidentsToDisplay === incidentCount
        ? "All"
        : `${numberofIncidentsToDisplay}`;
    expect(dropdown.innerHTML).toEqual(`Show ${selectorCount} Rows`);

    // Ensure the correct number of rows are displayed
    const numberCells = document.getElementsByClassName(
      "queue_incident_number"
    );
    expect(numberCells.length).toEqual(
      incidentCount > numberofIncidentsToDisplay
        ? numberofIncidentsToDisplay
        : incidentCount
    );
  };

  for (const incidentCount of [0, 10, 100, 200, defaultPageSize]) {
    for (const multiple of [0, 1, 2, 4]) {
      test(`show rows selection (${incidentCount}, ${multiple})`, async () => {
        await test_showRowsSelection(incidentCount, multiple);
      });
    }
  }

  test("search", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    await ims.addIncidentWithFields(
      // 1
      event.id,
      { summary: "Cat in tree" }
    );
    await ims.addIncidentWithFields(
      // 2
      event.id,
      { summary: "Dog in house" }
    );
    await ims.addIncidentWithFields(
      // 3
      event.id,
      { summary: "Cat in house" }
    );

    await act(async () => {
      renderWithIMSContext(<DispatchQueue event={event} />, ims);
    });

    const searchValue = "house";
    const searchField = document.getElementById("search_input");
    await act(async () => {
      // The delay here is a work-around to an issue in testing-library:
      // https://github.com/testing-library/user-event/issues/387#issuecomment-1020522982
      await userEvent.type(searchField, searchValue, { delay: 0.00001 });
    });

    expect(searchField).toHaveValue(searchValue);

    const numbers = Array.from(
      document.getElementsByClassName("queue_incident_number"),
      (cell) => parseInt(cell.innerHTML)
    );

    expect(new Set(numbers)).toEqual(new Set([2, 3]));
  });

  // test(
  //   "pagination",
  //   async () => {

  //   }
  // );
});

describe("DispatchQueue component: loading", () => {
  test("loading incidents", async () => {
    const ims = testIncidentManagementSystem();

    const event = await ims.eventWithID("1");
    renderWithIMSContext(<DispatchQueue event={event} />, ims);

    expect(screen.queryByText("Loading…")).toBeInTheDocument();

    await waitForEffects();
  });

  test("incidents fail to load", async () => {
    const ims = testIncidentManagementSystem();

    ims.incidents = jest.fn(async (event) => {
      throw new Error("because reasons...");
    });

    const spy = jest.spyOn(console, "warn");

    const event = await ims.eventWithID("1");

    renderWithIMSContext(<DispatchQueue event={event} />, ims);

    expect(
      await screen.findByText("Error loading incidents")
    ).toBeInTheDocument();

    expect(spy).toHaveBeenCalledWith(
      "Unable to fetch incidents: because reasons..."
    );
  });

  test("title with event name", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      renderWithIMSContext(<DispatchQueue event={event} />, ims);

      expect(
        await screen.findByText(`Dispatch Queue: ${event.name}`)
      ).toBeInTheDocument();
    }
  });
});
