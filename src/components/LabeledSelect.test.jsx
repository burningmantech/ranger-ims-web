import "@testing-library/jest-dom/extend-expect";
import { render, cleanup, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Incident from "../ims/model/Incident";

import LabeledSelect from "./LabeledSelect";

describe("LabeledSelect component", () => {
  test("start state selected", async () => {
    const values = ["1", "2", "3", "4"];

    for (const value of values) {
      render(
        <LabeledSelect id="id" label="label" values={values} selected={value} />
      );

      const select = screen.getByLabelText("label:");

      expect(select.value).toEqual(value);

      cleanup();
    }
  });

  test("new state selected", async () => {
    const values = ["1", "2", "3", "4"];

    for (const startValue of values) {
      for (const nextValue of values) {
        console.log(`${startValue} -> ${nextValue}`);

        render(
          <LabeledSelect
            id="id"
            label="label"
            values={values}
            selected={startValue}
          />
        );

        const select = screen.getByLabelText("label:");

        userEvent.selectOptions(select, [nextValue]);

        expect(select.value).toEqual(nextValue);

        cleanup();
      }
    }
  });

  test("onChange callback", async () => {
    const values = ["1", "2", "3", "4"];

    for (const startValue of values) {
      for (const nextValue of values) {
        const onChange = jest.fn();

        render(
          <LabeledSelect
            id="id"
            label="label"
            values={values}
            selected={startValue}
            onChange={onChange}
          />
        );

        const select = screen.getByLabelText("label:");

        userEvent.selectOptions(select, [nextValue]);

        expect(onChange).toHaveBeenCalledTimes(1);

        cleanup();
      }
    }
  });
});
