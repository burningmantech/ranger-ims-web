import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Loading from "./Loading";

describe("Loading component", () => {
  test("no args", () => {
    render(<Loading />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  test("condition false", () => {
    render(<Loading condition={false}>Hello</Loading>);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });

  test("condition true", () => {
    render(<Loading condition={true}>Hello</Loading>);

    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("condition true with what", () => {
    render(
      <Loading condition={true} what={"fluff"}>
        Hello
      </Loading>
    );

    expect(screen.queryByText("Loading fluff…")).not.toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("condition true, error true", () => {
    render(
      <Loading condition={true} error={true}>
        Hello
      </Loading>
    );

    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByText("Failed to load.")).not.toBeInTheDocument();
  });

  test("condition false, error true", () => {
    render(
      <Loading condition={false} error={true}>
        Hello
      </Loading>
    );

    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
    expect(screen.getByText("Failed to load.")).toBeInTheDocument();
  });

  test("condition false, error true with what", () => {
    render(
      <Loading condition={false} error={true} what={"fluff"}>
        Hello
      </Loading>
    );

    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
    expect(screen.getByText("Failed to load fluff.")).toBeInTheDocument();
  });
});
