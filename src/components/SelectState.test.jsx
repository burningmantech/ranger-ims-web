import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Incident from "../ims/model/Incident";
import { cartesian } from "../test/data";
import SelectState from "./SelectState";

describe("SelectState component", () => {
  test.each(Incident.states)("start state selected (%s)", async (state) => {
    render(<SelectState state={state} setState={() => {}} />);

    const select = screen.getByLabelText("State:");

    expect(select.value).toEqual(state);
  });

  // const test_newStateSelected = async (startState, nextState) => {
  //   console.log(`${startState} -> ${nextState}`);

  //   render(<SelectState state={startState} setState={() => {}} />);

  //   const select = screen.getByLabelText("State:");

  //   await userEvent.selectOptions(select, [nextState]);

  //   expect(select.value).toEqual(nextState);
  // };

  // for (const startState of Incident.states) {
  //   for (const nextState of Incident.states) {
  //     test(`new state selected (${startState}, ${nextState})`, async () => {
  //       await test_newStateSelected(startState, nextState);
  //     });
  //   }
  // }

  test.each(cartesian(Incident.states, Incident.states))(
    "onChange callback (%s, %s)",
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
