import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  alphabet_alphanumeric,
  arrayOf,
  cartesian,
  draw,
  randomSample,
  text,
} from "../test/data";
import LabeledSelect from "./LabeledSelect";

describe("LabeledSelect component", () => {
  const testData = () => {
    return Array.from(
      draw(
        4,
        arrayOf(
          text({ alphabet: alphabet_alphanumeric, minLength: 1, maxLength: 8 }),
          { minLength: 1 }
        )
      ),
      (values) => {
        return {
          values: values,
          value: randomSample(values, 1)[0],
          nextValue: randomSample(values, 1)[0],
        };
      }
    );
  };

  test.each(testData())(
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

  test.each(testData())("valueToName ($values.length)", ({ values }) => {
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

  test.each(testData())(
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
