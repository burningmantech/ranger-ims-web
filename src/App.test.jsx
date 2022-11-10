import "@testing-library/jest-dom/extend-expect";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { testIncidentManagementSystem } from "./ims/TestIMS";
import { URLs } from "./URLs";
import App from "./App";

export const waitForPage = async () => {
  await waitForElementToBeRemoved(() => screen.getByText("Loading page…"));
};

export const waitForLogin = async () => {
  return await screen.findByText("Log In");
};

export const waitForNavEvents = async () => {
  // Let effects complete
  await userEvent.click(screen.getByText("Event"));
  await waitForElementToBeRemoved(() => screen.getByText("Loading events…"));
};

export const waitForEvent = async () => {
  await waitForElementToBeRemoved(() => screen.getByText("Loading event…"));
};

export const waitForConcentricStreets = async () => {
  await waitForElementToBeRemoved(() =>
    screen.getByText("Loading concentric street names…")
  );
};

export const waitForIncidents = async () => {
  await waitForElementToBeRemoved(() => screen.getByText("Loading incidents…"));
};

export const waitForDispatchQueue = async () => {
  await Promise.all([waitForIncidents(), waitForConcentricStreets()]);
};

export const renderWithURL = (url, username, ims) => {
  if (ims == null) {
    ims = testIncidentManagementSystem(username);
  }

  const Router = ({ children }) => {
    return <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>;
  };

  return render(<App ims={ims} routerClass={Router} />);
};

describe("App component", () => {
  afterEach(() => {
    testIncidentManagementSystem().logout();
  });

  test("Loading page…", async () => {
    render(<App ims={testIncidentManagementSystem()} />);

    expect(screen.queryByText("Loading page…")).toBeInTheDocument();

    await waitForPage();
  });

  test("redirect root resource", async () => {
    renderWithURL("/");

    // Same expectations as for /ims (see next test)
    expect(await waitForLogin()).toBeInTheDocument();
    expect(screen.queryByText("Loading page…")).not.toBeInTheDocument();
  });

  test("load app, not logged in", async () => {
    renderWithURL(URLs.ims);

    expect(await waitForLogin()).toBeInTheDocument();
    expect(screen.queryByText("Loading page…")).not.toBeInTheDocument();
  });

  test("load app -> log in -> content", async () => {
    const username = "Hubcap";
    const password = username;

    renderWithURL(URLs.ims);

    expect(await waitForLogin()).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    expect(
      await screen.findByText("Ranger Incident Management System")
    ).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("load app -> invalid log in -> no content", async () => {
    const username = "Hubcap";
    const password = "Not My Password";

    renderWithURL(URLs.ims);

    expect(await waitForLogin()).toBeInTheDocument();

    console._suppressErrors();

    await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
    await userEvent.type(screen.getByLabelText(/Password/), password);
    await userEvent.click(screen.getByText(/Log In/));

    try {
      const title = await screen.findByText(
        "Ranger Incident Management System"
      );
      expect(title).not.toBeInTheDocument();
    } catch (e) {
      expect(e.name).toEqual("TestingLibraryElementError");
    }

    expect(screen.queryByText("Log In")).toBeInTheDocument();
  });

  test("load app, logged in", async () => {
    const username = "Hubcap";

    renderWithURL(URLs.ims, username);

    expect(
      await screen.findByText("Ranger Incident Management System")
    ).toBeInTheDocument();

    await waitForNavEvents();
  });

  const test_loadEventPageLoggedIn = async (eventID) => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);
    const event = await ims.eventWithID(eventID);

    renderWithURL(URLs.event(event.id), username, ims);

    expect(
      await screen.findByText(`Dispatch Queue: ${event.name}`)
    ).toBeInTheDocument();

    await waitForDispatchQueue();
  };

  for (const eventID of ["1", "2", "3", "4", "empty"]) {
    test(`load event page, logged in (${eventID})`, async () => {
      await test_loadEventPageLoggedIn(eventID);
    });
  }

  test("load admin page, logged in", async () => {
    const username = "Hubcap";
    const ims = testIncidentManagementSystem(username);

    renderWithURL(URLs.admin, username, ims);

    expect(await screen.findByText("Admin Console")).toBeInTheDocument();

    await waitForNavEvents();
  });

  test("not found", async () => {
    const username = "Hubcap";

    renderWithURL("/xyzzy", username);

    expect(await screen.findByText("Resource not found:")).toBeInTheDocument();
    expect(screen.queryByText("Loading page…")).not.toBeInTheDocument();

    await waitForNavEvents();
  });
});
