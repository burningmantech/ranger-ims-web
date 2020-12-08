import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { renderWithIMS } from "../contextTesting";
import { testIncidentManagementSystem } from "../ims/TestIMS";

import Page from "./Page";


describe("Page component", () => {

  test("id", () => {
    renderWithIMS(<Page />, testIncidentManagementSystem());

    expect(document.getElementById("page")).toBeInTheDocument();
  });

  test("includes navigation", () => {
    renderWithIMS(<Page />, testIncidentManagementSystem());

    expect(document.getElementById("page_navigation")).toBeInTheDocument();
  });

  test("includes children", () => {
    const content = "Hello!";

    renderWithIMS(<Page>{content}</Page>, testIncidentManagementSystem());

    expect(screen.queryByText(content)).toBeInTheDocument();
  });

});
