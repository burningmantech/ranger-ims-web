import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App component", () => {

    test("loading", () => {
      render(<App />);

      expect(screen.queryByText("Loading...")).toBeInTheDocument();
    });

    test("loaded home", async () => {
      render(<App />);

      expect(await screen.findByText(/Log In/)).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

});
