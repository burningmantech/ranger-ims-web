import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { URLs } from "../../URLs";
import { renderWithIMS } from "../../contextTesting";
import { testIncidentManagementSystem } from "../../ims/TestIMS";

import NavigationBar from "./NavigationBar";


describe("Navbar component", () => {

  test("id", () => {
    const navID = "who-what";

    renderWithIMS(<NavigationBar id={navID} />, testIncidentManagementSystem());

    expect(document.getElementById(navID)).toBeInTheDocument();
  });


  test("includes logo", () => {
    const navID = "nav_home_image";

    renderWithIMS(<NavigationBar />, testIncidentManagementSystem());

    expect(document.getElementById(navID)).toBeInTheDocument();
  });

  test("includes link to home", () => {
    renderWithIMS(<NavigationBar />, testIncidentManagementSystem());

    const link = document.getElementById("nav_home_link");

    expect(link).toBeInTheDocument();
    expect(link.href).toEqual(`http://localhost${URLs.home}`);
  });

  test("includes events dropdown", () => {
    renderWithIMS(<NavigationBar />, testIncidentManagementSystem());

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();
  });

  test("includes user dropdown", () => {
    renderWithIMS(<NavigationBar />, testIncidentManagementSystem());

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();
  });

});
