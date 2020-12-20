import moment from "moment";

import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import User from "../ims/User";
import { renderWithIMS, testIncidentManagementSystem } from "../ims/TestIMS";

import Home from "./Home";


describe("Home component", () => {

  // FIXME: this doesn't work...
  // test("null user", async () => {
  //   expect(
  //     () => render(<Home user={null} />)
  //   ).toThrow();
  // });

  test("heading", async () => {
    const username = "Hubcap";
    const user = new User(username, { expiration: moment().add(1, "hour")});

    renderWithIMS(<Home user={user} />, testIncidentManagementSystem());

    expect(
      screen.queryByText("Ranger Incident Management System")
    ).toBeInTheDocument();
  });

});
