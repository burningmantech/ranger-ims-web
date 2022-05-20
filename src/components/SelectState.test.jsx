import "@testing-library/jest-dom/extend-expect";
import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Incident from "../ims/model/Incident";

import SelectState from "./SelectState";

describe("SelectState component", () => {
  test("start state selected", async () => {
    for (const state of Incident.states) {
      render(<SelectState state={state} />);

      const select = screen.getByLabelText("State:");

      expect(select.value).toEqual(state);

      cleanup();
    }
  });

  test("new state selected", async () => {
    for (const startState of Incident.states) {
      for (const nextState of Incident.states) {
        console.log(`${startState} -> ${nextState}`);

        render(<SelectState state={startState} />);

        const select = screen.getByLabelText("State:");

        userEvent.selectOptions(select, [nextState]);

        expect(select.value).toEqual(nextState);

        cleanup();
      }
    }
  });

  test("onChange callback", async () => {
    for (const startState of Incident.states) {
      for (const nextState of Incident.states) {
        const onChange = jest.fn();

        render(<SelectState state={startState} onChange={onChange} />);

        const select = screen.getByLabelText("State:");

        userEvent.selectOptions(select, [nextState]);

        expect(onChange).toHaveBeenCalledTimes(1);

        cleanup();
      }
    }
  });
});
