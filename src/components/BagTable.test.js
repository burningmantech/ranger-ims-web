import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import { renderWithIMS } from "../contextTesting";

import BagTable from "./BagTable";

import { testIncidentManagementSystem, theBag } from "../ims/TestIMS";


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

  test("loaded bag", async () => {
    renderWithIMS(<BagTable />, testIncidentManagementSystem());

    for (const name in theBag.urls) {
      expect(await screen.findByText(name)).toBeInTheDocument();
    }
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  test("no urls in bag", async () => {
    const ims = testIncidentManagementSystem();
    ims._bag = {};

    renderWithIMS(<BagTable />, ims);

    expect(
      await screen.findByText("ERROR: no URLs in bag")
    ).toBeInTheDocument();
  });

  test("null urls in bag", async () => {
    const ims = testIncidentManagementSystem();
    ims._bag = { urls: null };

    renderWithIMS(<BagTable />, ims);

    expect(
      await screen.findByText("ERROR: no URLs in bag")
    ).toBeInTheDocument();
  });

});
