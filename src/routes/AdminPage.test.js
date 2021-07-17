import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import AdminPage from "./AdminPage";

import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";


describe("AdminPage component", () => {

  test(
    "heading", async () => {
      renderWithIMS(<AdminPage />, testIncidentManagementSystem());

      expect(screen.queryByText("AdminPage Console")).toBeInTheDocument();
    }
  );

});
