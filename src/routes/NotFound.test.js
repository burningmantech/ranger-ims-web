import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import { renderWithIMS } from "../contextTesting";
import { testIncidentManagementSystem } from "../ims/TestIMS";

import NotFound from "./NotFound";


describe("NotFound component", () => {

  test("not found", async () => {
    renderWithIMS(<NotFound />, testIncidentManagementSystem());

    expect(screen.queryByText("Resource not found:")).toBeInTheDocument();
    expect(screen.queryByText(window.location.href)).toBeInTheDocument();
  });

});
