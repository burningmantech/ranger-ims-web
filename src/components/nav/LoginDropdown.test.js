import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import { URL } from "../../URL";

import LoginDropdown from "./LoginDropdown";


describe("LoginDropdown component", () => {

  test("id", () => {
    render(<LoginDropdown />);

    expect(document.getElementById("nav_user_dropdown")).toBeInTheDocument();
  });

});
