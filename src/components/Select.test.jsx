import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { cartesian } from "../test/data";
import FormGroup from "./FormGroup";
import Label from "./Label";
import Select from "./Select";

describe("Select component", () => {
  const values = ["1", "2", "3", "4"];

  test.each(values)("start value selected (%s)", async (value) => {
    render(
      <FormGroup>
        <Label id="select_id" label="label" />
        <Select
          id="select_id"
          width="auto"
          value={value}
          setValue={() => {}}
          values={values.map((v) => [v, v])}
        />
      </FormGroup>
    );

    const select = screen.getByLabelText("label:");

    expect(select.value).toEqual(value);
  });

  test("valueToName", async () => {
    const values = ["1", "2", "3", "4"];
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
          value="1"
          setValue={() => {}}
          values={values.map((v) => [v, v])}
          valueToName={valueToName}
        />
      </FormGroup>
    );

    const select = screen.getByLabelText("label:");

    for (const option of select.options) {
      expect(option.textContent).toEqual(valueToName(option.value));
    }
  });

  test.each(cartesian(values, values))(
    "onChange callback (%s, %s)",
    async (value, nextValue) => {
      const setValue = jest.fn();

      render(
        <FormGroup>
          <Label id="select_id" label="label" />
          <Select
            id="select_id"
            width="auto"
            value={value}
            setValue={setValue}
            values={values.map((v) => [v, v])}
          />
        </FormGroup>
      );

      const select = screen.getByLabelText("label:");

      await userEvent.selectOptions(select, [nextValue]);

      expect(setValue).toHaveBeenCalledTimes(1);
      expect(setValue).toHaveBeenCalledWith(nextValue);
    }
  );
});
