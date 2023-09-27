import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Incident from "../../ims/model/Incident";
import { cartesian } from "../../test/data";

import SelectState from "./SelectState";

describe("SelectState component", () => {
  test.each(Incident.states)("start state selected (%s)", async (state) => {
    render(<SelectState state={state} setState={() => {}} />);

    const select = screen.getByLabelText("State:");

    expect(select.value).toEqual(state);
  });

  test.each(cartesian(Incident.states, Incident.states))(
    "setState callback (%s -> %s)",
    async (startState, nextState) => {
      const setState = jest.fn();

      render(<SelectState state={startState} setState={setState} />);

      const select = screen.getByLabelText("State:");

      await userEvent.selectOptions(select, [nextState]);

      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith(nextState);
    },
  );
});
