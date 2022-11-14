import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LabeledSelect from "./LabeledSelect";

describe("LabeledSelect component", () => {
  const test_defaultValueSelected = async (values, defaultValue) => {
    render(
      <LabeledSelect
        id="id"
        label="label"
        values={values.map((v) => [v, v])}
        defaultValue={defaultValue}
      />
    );

    const select = screen.getByLabelText("label:");

    expect(select.value).toEqual(defaultValue);
  };

  {
    const values = ["1", "2", "3", "4"];
    for (const defaultValue of values) {
      test(`start value selected (${defaultValue})`, async () => {
        await test_defaultValueSelected(values, defaultValue);
      });
    }
  }

  const test_newValueSelected = async (values, defaultValue, nextValue) => {
    console.log(`${defaultValue} -> ${nextValue}`);

    render(
      <LabeledSelect
        id="id"
        label="label"
        values={values.map((v) => [v, v])}
        defaultValue={defaultValue}
      />
    );

    const select = screen.getByLabelText("label:");

    await userEvent.selectOptions(select, [nextValue]);

    expect(select.value).toEqual(nextValue);
  };

  {
    const values = ["1", "2", "3", "4"];
    for (const defaultValue of values) {
      for (const nextValue of values) {
        test(`new value selected (${defaultValue}, ${nextValue})`, async () => {
          await test_newValueSelected(values, defaultValue, nextValue);
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

  const test_onChangeCallback = async (values, defaultValue, nextValue) => {
    const onChange = jest.fn();

    render(
      <LabeledSelect
        id="id"
        label="label"
        values={values.map((v) => [v, v])}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    );

    const select = screen.getByLabelText("label:");

    await userEvent.selectOptions(select, [nextValue]);

    expect(onChange).toHaveBeenCalledTimes(1);
  };

  {
    const values = ["1", "2", "3", "4"];
    for (const defaultValue of values) {
      for (const nextValue of values) {
        test(`onChange callback (${defaultValue}, ${nextValue})`, async () => {
          await test_onChangeCallback(values, defaultValue, nextValue);
        });
      }
    }
  }
});
