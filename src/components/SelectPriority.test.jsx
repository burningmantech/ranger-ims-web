import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Incident from "../ims/model/Incident";

import SelectPriority from "./SelectPriority";

describe("SelectPriority component", () => {
  test.each(Incident.priorities)(
    "start priority selected (%s)",
    async (priority) => {
      render(<SelectPriority priority={priority} setPriority={() => {}} />);

      const select = screen.getByLabelText("Priority:");

      expect(parseInt(select.value)).toEqual(priority);
    }
  );

  // const test_newPrioritySelected = async (startPriority, nextPriority) => {
  //   console.log(`${startPriority} -> ${nextPriority}`);

  //   render(<SelectPriority priority={startPriority} setPriority={() => {}} />);

  //   const select = screen.getByLabelText("Priority:");

  //   await userEvent.selectOptions(select, [nextPriority]);

  //   expect(select.value).toEqual(nextPriority);
  // };

  // for (const startPriority of Incident.priorities) {
  //   for (const nextPriority of Incident.priorities) {
  //     test(`new priority selected (${startPriority}, ${nextPriority})`, async () => {
  //       await test_newPrioritySelected(startPriority, nextPriority);
  //     });
  //   }
  // }

  test.each(
    Array.from(Incident.priorities, (start) =>
      Array.from(Incident.nonDeprecatedPriorities(start), (next) => [
        start,
        next,
      ])
    ).flat()
  )("setPriority callback (%s, %s)", async (startPriority, nextPriority) => {
    const setPriority = jest.fn();

    render(
      <SelectPriority priority={startPriority} setPriority={setPriority} />
    );

    const select = screen.getByLabelText("Priority:");

    await userEvent.selectOptions(select, [nextPriority.toString()]);

    expect(setPriority).toHaveBeenCalledTimes(1);
    expect(setPriority).toHaveBeenCalledWith(nextPriority); // expect integer here
  });

  // for (const startPriority of Incident.priorities) {
  //   const nonDeprecatedPriorities =
  //     Incident.nonDeprecatedPriorities(startPriority);
  //   for (const nextPriority of nonDeprecatedPriorities) {
  //     ...
  //   }
  // }
});
