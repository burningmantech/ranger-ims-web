import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Admin from "./Admin";


describe("Admin component", () => {

  test("heading", async () => {
    render(<Admin />);

    expect(screen.queryByText("Admin Console")).toBeInTheDocument();
  });

});
