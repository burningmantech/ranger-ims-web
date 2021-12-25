import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event';

import { renderWithRoute, testIncidentManagementSystem } from "./ims/TestIMS";
import { URLs } from "./URLs";
import App from "./App";


export const renderWithURL = (url, username, ims) => {
  if (ims == null) {
    ims = testIncidentManagementSystem(username);
  }

  const Router = (props) => {
    return (
      <MemoryRouter initialEntries={[url]}>
        {props.children}
      </MemoryRouter>
    );
  }

  return render(
    <App ims={ims} router={Router} />
  );
}


describe("App component", () => {

  afterEach(() => {
    testIncidentManagementSystem().logout();
  });

  test(
    "loading...", () => {
      render(<App ims={testIncidentManagementSystem()} />);

      expect(screen.queryByText("Loading...")).toBeInTheDocument();
    }
  );

  test(
    "redirect root resource", async () => {
      renderWithURL("/");

      // Same expectations as for /ims (see next test)
      expect(await screen.findByText(/Log In/)).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    }
  );

  test(
    "load app, not logged in", async () => {
      renderWithURL(URLs.ims);

      expect(await screen.findByText(/Log In/)).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    }
  );

  test(
    "load app -> log in -> content", async () => {
      const username = "Hubcap";
      const password = username;

      renderWithURL(URLs.ims);

      expect(await screen.findByText(/Log In/)).toBeInTheDocument();

      await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
      await userEvent.type(screen.getByLabelText(/Password/), password);
      await userEvent.click(screen.getByText(/Log In/));

      expect(
        await screen.findByText("Ranger Incident Management System")
      ).toBeInTheDocument();
    }
  );

  test(
    "load app -> invalid log in -> no content", async () => {
      const username = "Hubcap";
      const password = "Not My Password";

      renderWithURL(URLs.ims);

      expect(await screen.findByText(/Log In/)).toBeInTheDocument();

      await userEvent.type(screen.getByLabelText(/Ranger Handle/), username);
      await userEvent.type(screen.getByLabelText(/Password/), password);
      await userEvent.click(screen.getByText(/Log In/));

      try {
        const title = await screen.findByText(
          "Ranger Incident Management System"
        );
        expect(title).not.toBeInTheDocument();
      }
      catch (e) {
        expect(e.name).toEqual("TestingLibraryElementError");
      }

      expect(screen.queryByText("Log In")).toBeInTheDocument();
    }
  );

  test(
    "load app, logged in", async () => {
      const username = "Hubcap";

      renderWithURL(URLs.ims, username);

      expect(
        await screen.findByText("Ranger Incident Management System")
      ).toBeInTheDocument();
    }
  );

  test(
    "load event page, logged in", async () => {
      const username = "Hubcap";
      const ims = testIncidentManagementSystem(username);

      for (const event of await ims.events()) {
        await act(async () => {
          renderWithURL(URLs.event(event), username, ims);
        });

        expect(
          await screen.findByText(`Dispatch Queue: ${event.name}`)
        ).toBeInTheDocument();
      }
    }
  );

  test(
    "load admin page, logged in", async () => {
      const username = "Hubcap";
      const ims = testIncidentManagementSystem(username);

      renderWithURL(URLs.admin, username, ims);

      expect(await screen.findByText("Admin Console")).toBeInTheDocument();
    }
  );

  test(
    "not found", async () => {
      const username = "Hubcap";

      renderWithURL("/xyzzy", username);

      expect(
        await screen.findByText("Resource not found:")
      ).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    }
  );

});
