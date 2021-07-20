import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";

import AdminPage from "./AdminPage";

import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";


describe("AdminPage component", () => {

  test(
    "heading", async () => {
      await act(async () => {
        renderWithIMS(<AdminPage />, testIncidentManagementSystem());
      });

      expect(screen.queryByText("AdminPage Console")).toBeInTheDocument();
    }
  );

});
