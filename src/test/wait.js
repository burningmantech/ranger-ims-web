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
  console.debug("Waiting on events to load…");
  await userEvent.click(screen.getByText("Event"));
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading events…"),
  );
  console.debug("Events loaded");
};

export const waitForEvent = async () => {
  console.debug("Waiting on event to load…");
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading event…"),
  );
  console.debug("Event loaded");
};

export const waitForConcentricStreets = async () => {
  console.debug("Waiting on concentric streets to load…");
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading concentric street names…"),
  );
  console.debug("Concentric streets loaded");
};

export const waitForIncidents = async () => {
  console.debug("Waiting on incidents to load…");
  await waitForElementNotToBePresent(() =>
    screen.queryByText("Loading incidents…"),
  );
  console.debug("Incidents loaded");
};
