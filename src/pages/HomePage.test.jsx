import { DateTime } from "luxon";

import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import User from "../ims/User";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";

import HomePage from "./HomePage";

export const waitForEffects = async () => {
  // Let effects complete
  await userEvent.click(screen.getByText("Event"));
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading events…"),
  );
};

describe("HomePage component", () => {
  test("heading", async () => {
    const username = "Hubcap";
    const user = new User(username, {
      expiration: DateTime.local().plus({ hours: 1 }),
    });

    renderWithIMSContext(
      <HomePage user={user} />,
      testIncidentManagementSystem(),
    );
    await waitForEffects();

    expect(
      await screen.findByText("Ranger Incident Management System"),
    ).toBeInTheDocument();
  });
});
