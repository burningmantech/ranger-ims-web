import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FormGroup from "./FormGroup";
import Label from "./Label";
import Select from "./Select";

describe("Select component", () => {
  const test_defaultValueSelected = async (values, defaultValue) => {
    render(
      <FormGroup>
        <Label id="select_id" label="label" />
        <Select
          id="select_id"
          width="auto"
          values={values.map((v) => [v, v])}
          defaultValue={defaultValue}
        />
      </FormGroup>,
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
      <FormGroup>
        <Label id="select_id" label="label" />
        <Select
          id="select_id"
          width="auto"
          values={values.map((v) => [v, v])}
          defaultValue={defaultValue}
        />
      </FormGroup>,
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
      <FormGroup>
        <Label id="select_id" label="label" />
        <Select
          id="select_id"
          width="auto"
          values={values.map((v) => [v, v])}
          valueToName={valueToName}
        />
      </FormGroup>,
    );

    const select = screen.getByLabelText("label:");

    for (const option of select.options) {
      expect(option.textContent).toEqual(valueToName(option.value));
    }
  });

  const test_onChangeCallback = async (values, defaultValue, nextValue) => {
    const onChange = jest.fn();

    render(
      <FormGroup>
        <Label id="select_id" label="label" />
        <Select
          id="select_id"
          width="auto"
          values={values.map((v) => [v, v])}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      </FormGroup>,
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
