import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FormGroup from "./FormGroup";
import Label from "./Label";
import Select from "./Select";

describe("Select component", () => {
  const test_valueSelected = async (value, values) => {
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
  };

  {
    const values = ["1", "2", "3", "4"];
    for (const value of values) {
      test(`start value selected (${value})`, async () => {
        await test_valueSelected(value, values);
      });
    }
  }

  // const test_newValueSelected = async (value, values, nextValue) => {
  //   console.log(`${value} -> ${nextValue}`);

  //   render(
  //     <FormGroup>
  //       <Label id="select_id" label="label" />
  //       <Select
  //         id="select_id"
  //         width="auto"
  //         value={value}
  //         setValue={() => {}}
  //         values={values.map((v) => [v, v])}
  //       />
  //     </FormGroup>
  //   );

  //   const select = screen.getByLabelText("label:");

  //   await userEvent.selectOptions(select, [nextValue]);

  //   expect(select.value).toEqual(nextValue);
  // };

  // {
  //   const values = ["1", "2", "3", "4"];
  //   for (const value of values) {
  //     for (const nextValue of values) {
  //       test(`new value selected (${value}, ${nextValue})`, async () => {
  //         await test_newValueSelected(value, values, nextValue);
  //       });
  //     }
  //   }
  // }

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

  const test_onChangeCallback = async (value, values, nextValue) => {
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
  };

  {
    const values = ["1", "2", "3", "4"];
    for (const value of values) {
      for (const nextValue of values) {
        test(`onChange callback (${value}, ${nextValue})`, async () => {
          await test_onChangeCallback(value, values, nextValue);
        });
      }
    }
  }
});
