import { DateTime } from "luxon";

import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import User from "../ims/User";
import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";

import HomePage from "./HomePage";


describe("HomePage component", () => {

  test("heading", async () => {
    const username = "Hubcap";
    const user = new User(
      username, { expiration: DateTime.local().plus({ hours: 1 }) }
    );

    renderWithIMS(<HomePage user={user} />, testIncidentManagementSystem());

    expect(
      screen.queryByText("Ranger Incident Management System")
    ).toBeInTheDocument();
  });

});
