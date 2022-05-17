import "@testing-library/jest-dom/extend-expect";
import { render, cleanup, screen } from "@testing-library/react";

import Incident from "../ims/model/Incident";

import SelectState from "./SelectState";

describe("SelectState component", () => {
  test("State selected", async () => {
    for (const state of Incident.states) {
      render(<SelectState state={state} />);

      const select = screen.getByLabelText("State:");

      expect(select.value).toEqual(state);

      cleanup();
    }
  });
});
