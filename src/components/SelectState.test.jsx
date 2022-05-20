import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Incident from "../ims/model/Incident";

import SelectState from "./SelectState";

describe("SelectState component", () => {
  const test_startStateSelected = async (state) => {
    render(<SelectState state={state} />);

    const select = screen.getByLabelText("State:");

    expect(select.value).toEqual(state);
  };

  for (const state of Incident.states) {
    test(`start state selected (${state})`, async () => {
      await test_startStateSelected(state);
    });
  }

  const test_newStateSelected = async (startState, nextState) => {
    console.log(`${startState} -> ${nextState}`);

    render(<SelectState state={startState} />);

    const select = screen.getByLabelText("State:");

    userEvent.selectOptions(select, [nextState]);

    expect(select.value).toEqual(nextState);
  };

  for (const startState of Incident.states) {
    for (const nextState of Incident.states) {
      test(`new state selected (${startState}, ${nextState})`, async () => {
        await test_newStateSelected(startState, nextState);
      });
    }
  }

  const test_onChangeCallback = async (startState, nextState) => {
    const onChange = jest.fn();

    render(<SelectState state={startState} onChange={onChange} />);

    const select = screen.getByLabelText("State:");

    userEvent.selectOptions(select, [nextState]);

    expect(onChange).toHaveBeenCalledTimes(1);
  };

  for (const startState of Incident.states) {
    for (const nextState of Incident.states) {
      test(`onChange callback (${startState}, ${nextState})`, async () => {
        await test_onChangeCallback(startState, nextState);
      });
    }
  }
});
