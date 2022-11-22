import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { renderWithIMSContext } from "../ims/TestIMS";
import { waitForNavBar } from "../test/wait";

import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage component", () => {
  test("not found", async () => {
    const path = "/xyzzy/";

    renderWithIMSContext(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitForNavBar();

    expect(await screen.findByText("Resource not found:")).toBeInTheDocument();
    expect(await screen.findByText(path)).toBeInTheDocument();
  });
});
