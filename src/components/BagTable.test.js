import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";

import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";

import BagTable from "./BagTable";


describe("BagTable component", () => {

  test("id", async () => {
    await act(async () => {
      renderWithIMS(<BagTable />, testIncidentManagementSystem());
    });

    expect(document.getElementById("bag_table")).toBeInTheDocument();
  });

  test("caption", async () => {
    await act(async () => {
      renderWithIMS(<BagTable />, testIncidentManagementSystem());
    });

    expect(screen.queryByText("IMS Bag")).toBeInTheDocument();
  });

  test("loading bag", async () => {
    await act(async () => {
      renderWithIMS(<BagTable />, testIncidentManagementSystem());
      expect(screen.queryByText("Loading...")).toBeInTheDocument();
    });
  });

  test("bag fails to load", async () => {
    const ims = testIncidentManagementSystem();

    ims.bag = jest.fn(
      () => { throw new Error("because reasons..."); }
    );

    const spy = jest.spyOn(console, "error");

    renderWithIMS(<BagTable />, ims);

    expect(screen.queryByText("Error loading URL bag")).toBeInTheDocument();

    expect(spy).toHaveBeenCalledWith(
      "Unable to fetch bag: because reasons..."
    );
  });

  test("loaded bag", async () => {
    const ims = testIncidentManagementSystem();

    renderWithIMS(<BagTable />, ims);

    for (const name in ims.testData.bag.urls) {
      expect(await screen.findByText(name)).toBeInTheDocument();
    }
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  test("no urls in bag", async () => {
    const ims = testIncidentManagementSystem();
    ims.testData.bag = {};

    renderWithIMS(<BagTable />, ims);

    expect(
      await screen.findByText("ERROR: no URLs in bag")
    ).toBeInTheDocument();
  });

  test("null urls in bag", async () => {
    const ims = testIncidentManagementSystem();
    ims.testData.bag = { urls: null };

    renderWithIMS(<BagTable />, ims);

    expect(
      await screen.findByText("ERROR: no URLs in bag")
    ).toBeInTheDocument();
  });

});
