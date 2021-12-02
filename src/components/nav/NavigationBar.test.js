import "@testing-library/jest-dom/extend-expect";
import { act, render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import { URLs } from "../../URLs";
import { renderWithIMSContext, testIncidentManagementSystem } from "../../ims/TestIMS";

import NavigationBar from "./NavigationBar";


describe("Navbar component", () => {

  test("id", async () => {
    const navID = "who-what";

    await act(async () => {
      renderWithIMSContext(
        <NavigationBar id={navID} />, testIncidentManagementSystem()
      );
    });

    expect(document.getElementById(navID)).toBeInTheDocument();
  });


  test("includes logo", async () => {
    const navID = "nav_home_image";

    await act(async () => {
      renderWithIMSContext(
        <NavigationBar id={navID} />, testIncidentManagementSystem()
      );
    });

    expect(document.getElementById(navID)).toBeInTheDocument();
  });

  test("includes link to home", async () => {
    await act(async () => {
      renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());
    });

    const link = document.getElementById("nav_home_link");

    expect(link).toBeInTheDocument();
    expect(link.href).toEqual(`http://localhost${URLs.ims}`);
  });

  test("includes events dropdown", async () => {
    await act(async () => {
      renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());
    });

    expect(document.getElementById("nav_events_dropdown")).toBeInTheDocument();
  });

  test("includes user dropdown", async () => {
    await act(async () => {
      renderWithIMSContext(<NavigationBar />, testIncidentManagementSystem());
    });

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();
  });

});
