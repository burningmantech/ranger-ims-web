import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Component } from "react";

import Page from "./Page";


describe("Page component", () => {

  test("page container", () => {
    render(<Page />);

    expect(document.getElementById("page")).toBeInTheDocument();
  });

  test("includes navigation", () => {
    render(<Page />);

    expect(document.getElementById("page_navigation")).toBeInTheDocument();
  });

  test("includes children", () => {
    const content = "Hello!";

    render(<Page>{content}</Page>);

    expect(screen.queryByText(content)).toBeInTheDocument();
  });

});
