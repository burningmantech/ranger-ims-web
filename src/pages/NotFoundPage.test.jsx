import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { renderWithIMSContext } from "../ims/TestIMS";

import NotFoundPage from "./NotFoundPage";

export const waitForEffects = async () => {
  // Let effects complete
  await userEvent.click(screen.getByText("Event"));
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading events…")
  );
};

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
    await waitForEffects();

    expect(await screen.findByText("Resource not found:")).toBeInTheDocument();
    expect(await screen.findByText(path)).toBeInTheDocument();
  });
});
