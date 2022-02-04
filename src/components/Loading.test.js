import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Loading from "./Loading";

describe("Loading component", () => {
  test("render", () => {
    render(<Loading />);

    expect(screen.queryByText("Loading...")).toBeInTheDocument();
  });
});
