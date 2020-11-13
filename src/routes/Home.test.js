import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Home from "./Home";


describe("Home component", () => {

    test("loading", () => {
      render(<Home user={null} />);

      expect(screen.queryByText("Loading...")).toBeInTheDocument();
    });

    test("loaded login", async () => {
      render(<Home user={null} />);

      expect(await screen.findByText(/Log In/)).toBeInTheDocument();
    });

});
