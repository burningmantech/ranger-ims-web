import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

//
// waitForElementToBeRemoved errors out if the element isn't there at least
// once, and that's causing grief.
// Possible issue:
//   https://github.com/testing-library/react-testing-library/issues/865
// We see the same flakiness, but it's not clear that it's the same root cause.
//
export const waitForElementNotToBePresent = async (elementGetter) => {
  await waitFor(() => {
    expect(elementGetter()).not.toBeInTheDocument();
  });
};

export const waitForNavEvents = async () => {
  await userEvent.click(screen.getByText("Event"));
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading events…")
  );
};

export const waitForNavBar = waitForNavEvents;

export const waitForEvent = async () => {
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading event…")
  );
};

export const waitForConcentricStreets = async () => {
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading concentric street names…")
  );
};

export const waitForIncidents = async () => {
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading incidents…")
  );
};
