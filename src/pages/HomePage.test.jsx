import { DateTime } from "luxon";

import { screen } from "@testing-library/react";

import User from "../ims/User";
import {
  renderWithIMSContext,
  testIncidentManagementSystem,
} from "../ims/TestIMS";
import { waitForNavEvents } from "../test/wait";

import HomePage from "./HomePage";

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
    await waitForNavEvents();

    expect(
      await screen.findByText("Ranger Incident Management System"),
    ).toBeInTheDocument();
  });
});
