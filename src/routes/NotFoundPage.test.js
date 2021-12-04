import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { renderWithIMSContext, testIncidentManagementSystem } from "../ims/TestIMS";

import NotFoundPage from "./NotFoundPage";


describe("NotFoundPage component", () => {

  test(
    "not found", async () => {
      const path = "/xyzzy/";

      await act(async () => {
        renderWithIMSContext(
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(screen.queryByText("Resource not found:")).toBeInTheDocument();
      expect(screen.queryByText(path)).toBeInTheDocument();
    }
  );

});
