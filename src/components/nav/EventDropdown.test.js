import "@testing-library/jest-dom/extend-expect";

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { renderWithIMS, testIncidentManagementSystem } from "../../ims/TestIMS";

import EventDropdown from "./EventDropdown";


describe("EventDropdown component", () => {

  test("id", () => {
    renderWithIMS(<EventDropdown />, testIncidentManagementSystem());

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();
  });

});
