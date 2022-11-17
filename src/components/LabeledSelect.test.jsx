import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LabeledSelect from "./LabeledSelect";

describe("LabeledSelect component", () => {
  const values = ["1", "2", "3", "4"];

  test.each(values)("start value selected (%s)", async (value) => {
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
  });

  test("valueToName", async () => {
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
  });

  test.each(cartesian(values, values))(
    "setValue callback (%s, %d)",
    async (value, nextValue) => {
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
