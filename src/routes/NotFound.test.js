import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import NotFound from "./NotFound";


describe("NotFound component", () => {

  test("not found", async () => {
    render(<NotFound />);

    expect(screen.queryByText("Resource not found:")).toBeInTheDocument();
    expect(screen.queryByText(window.location.href)).toBeInTheDocument();
  });

});
