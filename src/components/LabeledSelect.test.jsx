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
        setValue={(v) => {}}
        values={values.map((v) => [v, v])}
      />
    );

    const select = screen.getByLabelText("label:");

    expect(select.value).toEqual(value);
  });

  // const test_newValueSelected = async (value, values, nextValue) => {
  //   console.log(`${value} -> ${nextValue}`);

  //   render(
  //     <LabeledSelect
  //       id="id"
  //       label="label"
  //       value={value}
  //       setValue={(v) => {}}
  //       values={values.map((v) => [v, v])}
  //     />
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

  // test("valueToName", async () => {
  //   const values = ["1", "2", "3", "4"];
  //   const valueToName = (value) => {
  //     if (value === undefined || value == "----") {
  //       return "----";
  //     } else {
  //       return "***" + value + "***";
  //     }
  //   };

  //   render(
  //     <LabeledSelect
  //       id="id"
  //       label="label"
  //       value="1"
  //       setValue={(v) => {}}
  //       values={values.map((v) => [v, v])}
  //       valueToName={valueToName}
  //     />
  //   );

  //   const select = screen.getByLabelText("label:");

  //   for (const option of select.options) {
  //     expect(option.textContent).toEqual(valueToName(option.value));
  //   }
  // });

  test.each(cartesian(values, values))(
    "onChange callback (%s, %d)",
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
