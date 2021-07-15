import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";

import BagTable from "./BagTable";


describe("BagTable component", () => {

  test("id", async () => {
    renderWithIMS(<BagTable />, testIncidentManagementSystem());

    expect(document.getElementById("bag_table")).toBeInTheDocument();
  });

  test("caption", async () => {
    renderWithIMS(<BagTable />, testIncidentManagementSystem());

    expect(screen.queryByText("IMS Bag")).toBeInTheDocument();
  });

  test("loading bag", async () => {
    renderWithIMS(<BagTable />, testIncidentManagementSystem());

    expect(screen.queryByText("Loading...")).toBeInTheDocument();
  });

  test("bag fails to load", async () => {
    const ims = testIncidentManagementSystem();

    ims.bag = jest.fn(
      () => { throw new Error("Can't load bag because reasons..."); }
    );

    const spy = jest.spyOn(console, "error");

    renderWithIMS(<BagTable />, ims);

    expect(screen.queryByText("Error loading URL bag")).toBeInTheDocument();

    expect(spy).toHaveBeenCalledWith(
      "Unable to load BagTable: Can't load bag because reasons..."
    );
  });

  test("bag loads after unmount", async () => {
    const ims = testIncidentManagementSystem();

    let done;
    const promise = new Promise((resolve, reject) => { done = resolve; });

    class TestBagTable extends BagTable {
      fetch = () => {
        console.info("Starting fetch...");
        return promise.then(() => {
          console.info("...done fetching");
          this._setBag({});
        });
      }
    }

    const container = renderWithIMS((<TestBagTable />), ims);

    container.unmount();

    const spy = jest.spyOn(console, "debug");

    done();
    await promise;

    expect(spy).toHaveBeenCalledWith(
      "Received bag after TestBagTable unmounted."
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
