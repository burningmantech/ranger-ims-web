import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LabeledSelect from "./LabeledSelect";

describe("LabeledSelect component", () => {
  const test_startValueSelected = async (values, value) => {
    render(
      <LabeledSelect
        id="id"
        label="label"
        values={values.map((v) => [v, v])}
        defaultValue={value}
      />
    );

    const select = screen.getByLabelText("label:");

    expect(select.value).toEqual(value);
  };

  {
    const values = ["1", "2", "3", "4"];
    for (const value of values) {
      test(`start value selected (${value})`, async () => {
        await test_startValueSelected(values, value);
      });
    }
  }

  const test_newValueSelected = async (values, startValue, nextValue) => {
    console.log(`${startValue} -> ${nextValue}`);

    render(
      <LabeledSelect
        id="id"
        label="label"
        values={values.map((v) => [v, v])}
        defaultValue={startValue}
      />
    );

    const select = screen.getByLabelText("label:");

    await userEvent.selectOptions(select, [nextValue]);

    expect(select.value).toEqual(nextValue);
  };

  {
    const values = ["1", "2", "3", "4"];
    for (const startValue of values) {
      for (const nextValue of values) {
        test(`new value selected (${startValue}, ${nextValue})`, async () => {
          await test_newValueSelected(values, startValue, nextValue);
        });
      }
    }
  }

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
      <LabeledSelect
        id="id"
        label="label"
        values={values.map((v) => [v, v])}
        valueToName={valueToName}
      />
    );

    const select = screen.getByLabelText("label:");

    for (const option of select.options) {
      expect(option.textContent).toEqual(valueToName(option.value));
    }
  });

  const test_onChangeCallback = async (values, startValue, nextValue) => {
    const onChange = jest.fn();

    render(
      <LabeledSelect
        id="id"
        label="label"
        values={values.map((v) => [v, v])}
        defaultValue={startValue}
        onChange={onChange}
      />
    );

    const select = screen.getByLabelText("label:");

    await userEvent.selectOptions(select, [nextValue]);

    expect(onChange).toHaveBeenCalledTimes(1);
  };

  {
    const values = ["1", "2", "3", "4"];
    for (const startValue of values) {
      for (const nextValue of values) {
        test(`onChange callback (${startValue}, ${nextValue})`, async () => {
          await test_onChangeCallback(values, startValue, nextValue);
        });
      }
    }
  }
});
