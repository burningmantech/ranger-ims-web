import { screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { renderWithIMSContext } from "../ims/TestIMS";
import { waitForNavEvents } from "../test/wait";

import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage component", () => {
  test("not found", async () => {
    const path = "/xyzzy/";

    renderWithIMSContext(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitForNavEvents();

    expect(await screen.findByText("Resource not found:")).toBeInTheDocument();
    expect(await screen.findByText(path)).toBeInTheDocument();
  });
});
