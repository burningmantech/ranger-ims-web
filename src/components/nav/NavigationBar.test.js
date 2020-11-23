import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { URL } from "../../URL";

import NavigationBar from "./NavigationBar";


describe("Navbar component", () => {

  test("id", () => {
    const navID = "who-what";

    render(<NavigationBar id={navID} />);

    expect(document.getElementById(navID)).toBeInTheDocument();
  });


  test("includes logo", () => {
    const navID = "nav_home_image";

    render(<NavigationBar id={navID} />);

    expect(document.getElementById(navID)).toBeInTheDocument();
  });

  test("includes link to home", () => {
    render(<NavigationBar />);

    const link = document.getElementById("nav_home_link");

    expect(link).toBeInTheDocument();
    expect(link.href).toEqual(`http://localhost${URL.home}`);
  });

});
