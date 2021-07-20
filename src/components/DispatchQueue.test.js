import "@testing-library/jest-dom/extend-expect";
import { act, screen } from "@testing-library/react";

import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";

import DispatchQueue from "./DispatchQueue";


describe("DispatchQueue component", () => {

  test(
    "id",
    async () => {
      await act(async () => {
        renderWithIMS(<DispatchQueue />, testIncidentManagementSystem());
      });

      expect(screen.queryByText("Hello")).toBeInTheDocument();
    }
  );

});
