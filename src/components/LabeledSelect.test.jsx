import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { selectOptionValues } from "../test/data";
import LabeledSelect from "./LabeledSelect";

describe("LabeledSelect component", () => {
  test.each(selectOptionValues())(
    "start value selected ($values.length, $value)",
    ({ values, value }) => {
      render(
        <LabeledSelect
          id="id"
          label="label"
          value={value}
          setValue={throwError}
          values={values.map((v) => [v, v])}
        />
      );

      const select = screen.getByLabelText("label:");

      expect(select.value).toEqual(value);
    }
  );

  test.each(selectOptionValues())(
    "valueToName ($values.length)",
    ({ values }) => {
      const valueToName = (value) => {
        if (value === undefined || value == "----") {
          return "----";
        } else {
          return "***" + value + "***";
        }
      };

      render(
        <LabeledSelect
          id="id"
          label="label"
          value="1"
          setValue={throwError}
          values={values.map((v) => [v, v])}
          valueToName={valueToName}
        />
      );

      const select = screen.getByLabelText("label:");

      for (const option of select.options) {
        expect(option.textContent).toEqual(valueToName(option.value));
      }
    }
  );

  test.each(selectOptionValues())(
    "setValue callback ($values.length, $value -> $nextValue)",
    async ({ values, value, nextValue }) => {
      const setValue = jest.fn();

      render(
        <LabeledSelect
          id="id"
          label="label"
          value={value}
          setValue={setValue}
          values={values.map((v) => [v, v])}
        />
      );

      const select = screen.getByLabelText("label:");

      await userEvent.selectOptions(select, [nextValue]);

      expect(setValue).toHaveBeenCalledTimes(1);
      expect(setValue).toHaveBeenCalledWith(nextValue);
    }
  );
});
