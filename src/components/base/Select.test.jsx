import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { selectOptionValues } from "../../test/data";

import FormGroup from "./FormGroup";
import Label from "./Label";
import Select from "./Select";

describe("Select component", () => {
  test.each(selectOptionValues())(
    "start value selected ($values.length, $value)",
    ({ values, value }) => {
      render(
        <FormGroup>
          <Label id="select_id" label="label" />
          <Select
            id="select_id"
            width="auto"
            values={values.map((v) => [v, v])}
            value={value}
            setValue={() => {}}
          />
        </FormGroup>,
      );

      const select = screen.getByLabelText("label:");

      expect(select.value).toEqual(value);
    },
  );

  test.each(selectOptionValues())(
    "valueToName ($values.length, $value)",
    ({ values, value }) => {
      const valueToName = (value) => {
        if (value === undefined || value == "----") {
          return "----";
        } else {
          return "***" + value + "***";
        }
      };

      render(
        <FormGroup>
          <Label id="select_id" label="label" />
          <Select
            id="select_id"
            width="auto"
            values={values.map((v) => [v, v])}
            value={value}
            setValue={() => {}}
            valueToName={valueToName}
          />
        </FormGroup>,
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
        <FormGroup>
          <Label id="select_id" label="label" />
          <Select
            id="select_id"
            width="auto"
            values={values.map((v) => [v, v])}
            value={value}
            setValue={setValue}
          />
        </FormGroup>,
      );

      const select = screen.getByLabelText("label:");

      await userEvent.selectOptions(select, [nextValue]);

      expect(setValue).toHaveBeenCalledTimes(1);
      expect(setValue).toHaveBeenCalledWith(nextValue);
    },
  );
});
