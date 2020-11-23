import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { URL } from "../URL";

import Navbar from "./Navbar";


describe("Navbar component", () => {

  test("id", () => {
    const navID = "who-what";

    render(<Navbar id={navID} />);

    expect(document.getElementById(navID)).toBeInTheDocument();
  });


  test("includes logo", () => {
    const navID = "nav_home_image";

    render(<Navbar id={navID} />);

    expect(document.getElementById(navID)).toBeInTheDocument();
  });

  test("includes link to home", () => {
    render(<Navbar />);

    const link = document.getElementById("nav_home_link");

    expect(link).toBeInTheDocument();
    expect(link.href).toEqual(`http://localhost${URL.home}`);
  });

});
