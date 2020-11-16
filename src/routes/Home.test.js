import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import User from "../auth";
import Home from "./Home";


describe("Home component", () => {

  test("user", async () => {
    const username = "Cheese Butter";

    render(<Home user={new User(username)} />);

    expect(
      await screen.findByText("Ranger Incident Management System")
    ).toBeInTheDocument();
  });

});
