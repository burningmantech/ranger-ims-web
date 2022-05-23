import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Loading from "./Loading";

describe("Loading component", () => {
  test("render", () => {
    render(<Loading />);

    expect(screen.queryByText("Loading…")).toBeInTheDocument();
  });
});
