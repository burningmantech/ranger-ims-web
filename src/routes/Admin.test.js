import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Admin from "./Admin";

import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";


describe("Admin component", () => {

  test("heading", async () => {
    renderWithIMS(<Admin />, testIncidentManagementSystem());

    expect(screen.queryByText("Admin Console")).toBeInTheDocument();
  });

});
