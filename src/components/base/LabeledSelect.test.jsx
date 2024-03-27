import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { selectOptionValues } from "../../test/data";
import { throwError } from "../../test/throw";
import LabeledSelect from "./LabeledSelect";

describe("LabeledSelect component", () => {
  test.each(selectOptionValues())(
    "start value selected ($values.length, $value)",
    ({ values, value }) => {
      render(
        <LabeledSelect
          id="id"
          label="label"
          values={values.map((v) => [v, v])}
          value={value}
          setValue={throwError}
        />,
      );

      const select = screen.getByLabelText("label:");

      expect(select.value).toEqual(value);
    },
  );

  test.each(selectOptionValues())(
    "valueToName ($values.length)",
    ({ values }) => {
      const valueToName = (value) => {
        if (value === undefined || value === "----") {
          return "----";
        } else {
          return "***" + value + "***";
        }
      };

      render(
        <LabeledSelect
          id="id"
          label="label"
          values={values.map((v) => [v, v])}
          value="1"
          setValue={throwError}
          valueToName={valueToName}
        />,
      );

      const select = screen.getByLabelText("label:");

      for (const option of select.options) {
        expect(option.textContent).toEqual(valueToName(option.value));
      }
    },
  );

  test.each(selectOptionValues())(
    "setValue callback ($values.length, $value -> $nextValue)",
    async ({ values, value, nextValue }) => {
      const setValue = jest.fn();

      render(
        <LabeledSelect
          id="id"
          label="label"
          values={values.map((v) => [v, v])}
          value={value}
          setValue={setValue}
        />,
      );

      const select = screen.getByLabelText("label:");

      await userEvent.selectOptions(select, [nextValue]);

      expect(setValue).toHaveBeenCalledTimes(1);
      expect(setValue).toHaveBeenCalledWith(nextValue);
    },
  );
});
