import invariant from "invariant";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { URLs } from "../../URLs";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../../ims/TestIMS";
import { cartesian } from "../../test/data";
import { waitForConcentricStreets, waitForIncidents } from "../../test/wait";

import { defaultPageSize } from "./format";
import DispatchQueue from "./DispatchQueue";

export const waitForEffects = async () => {
  await waitForIncidents();
  await waitForConcentricStreets();
};

describe("DispatchQueue component: table", () => {
  // Test with 0, 10, 20, ... 200 incidents in the system
  test.each([0, 10, 44, 50, 201, defaultPageSize])(
    "displayed incidents are valid up to page size (%d)",
    async (incidentCount) => {
      const ims = testIncidentManagementSystem();
      const event = await ims.eventWithID("empty");

      await ims.addMoreIncidents(event.id, incidentCount);

      // Make sure addMoreIncidents worked
      const incidents = await ims.incidents(event.id);
      invariant(
        incidents.length === incidentCount,
        `Failed to add incidents (${incidents.length} != ${incidentCount})`,
      );

      renderWithIMSContext(<DispatchQueue event={event} />, ims);
      await waitForEffects();

      const numberCells = document.getElementsByClassName(
        "queue_incident_number",
      );

      expect(numberCells.length).toEqual(
        incidents.length > defaultPageSize ? defaultPageSize : incidents.length,
      );

      for (const numberCell of numberCells) {
        const incidentNumber = parseInt(numberCell.innerHTML);
        await expect(() =>
          ims.incidentWithNumber(event.id, incidentNumber),
        ).notToReject();
      }
    },
  );

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
        await userEvent.click(cell);

        expect(window.open).toHaveBeenCalledWith(url, context);
      }
    }
  });
});

describe("DispatchQueue component: controls", () => {
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

  test.each(cartesian([0, 10, 100, 200, defaultPageSize], [0, 1, 2, 4]))(
    "show rows selection (%d, %d)",
    async (incidentCount, multiple) => {
      const ims = testIncidentManagementSystem();
      const event = await ims.eventWithID("empty");

      await ims.addMoreIncidents(event.id, incidentCount);

      renderWithIMSContext(<DispatchQueue event={event} />, ims);
      await waitForEffects();

      const dropdown = document.getElementById("queue_show_rows_dropdown");
      await userEvent.click(dropdown);

      const selectorID = `queue_show_rows_${multiple}`;
      const selector = document.getElementById(selectorID);
      await userEvent.click(selector);

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
        "queue_incident_number",
      );
      expect(numberCells.length).toEqual(
        incidentCount > numberofIncidentsToDisplay
          ? numberofIncidentsToDisplay
          : incidentCount,
      );
    },
  );

  test("search", async () => {
    const ims = testIncidentManagementSystem();
    const event = await ims.eventWithID("empty");

    await ims.addIncidentWithFields(
      // 1
      event.id,
      { summary: "Cat in tree" },
    );
    await ims.addIncidentWithFields(
      // 2
      event.id,
      { summary: "Dog in house" },
    );
    await ims.addIncidentWithFields(
      // 3
      event.id,
      { summary: "Cat in house" },
    );

    renderWithIMSContext(<DispatchQueue event={event} />, ims);
    await waitForEffects();

    const searchValue = "house";
    const searchField = document.getElementById("search_input");
    // The delay here is a work-around to an issue in testing-library:
    // https://github.com/testing-library/user-event/issues/387#issuecomment-1020522982
    await userEvent.type(searchField, searchValue, { delay: 0.00001 });

    expect(searchField).toHaveValue(searchValue);

    const numbers = Array.from(
      document.getElementsByClassName("queue_incident_number"),
      (cell) => parseInt(cell.innerHTML),
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

    expect(screen.getByText("Loading incidents…")).toBeInTheDocument();

    await waitForEffects();
  });

  test("incidents fail to load", async () => {
    const ims = testIncidentManagementSystem();

    ims.incidents = jest.fn(async (event) => {
      throw new Error("because reasons...");
    });
    console._suppressErrors();

    const event = await ims.eventWithID("1");

    renderWithIMSContext(<DispatchQueue event={event} />, ims);
    await waitForEffects();

    expect(
      await screen.findByText("Failed to load incidents."),
    ).toBeInTheDocument();

    expect(console.info).toHaveBeenCalledWith(
      "Unable to fetch incidents: because reasons...",
    );
  });

  test("title with event name", async () => {
    const ims = testIncidentManagementSystem();

    for (const event of await ims.events()) {
      renderWithIMSContext(<DispatchQueue event={event} />, ims);
      await waitForEffects();

      expect(
        await screen.findByText(`Dispatch Queue: ${event.name}`),
      ).toBeInTheDocument();
    }
  });
});
