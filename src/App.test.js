import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event';

import { testIncidentManagementSystem } from "./ims/TestIMS";
import App from "./App";


export const renderWithURL = (url, username) => {
  const Router = (props) => {
    return (
      <MemoryRouter initialEntries={[url]}>
        {props.children}
      </MemoryRouter>
    );
  }

  return render(
    <App ims={testIncidentManagementSystem(username)} router={Router} />
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
    "load app", async () => {
      renderWithURL("/ims/");

      expect(await screen.findByText(/Log In/)).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    }
  );

  test(
    "load app -> log in -> content", async () => {
      const username = "Hubcap";
      const password = username;

      renderWithURL("/ims/");

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

      renderWithURL("/ims/");

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

      renderWithURL("/ims/", username);

      expect(
        await screen.findByText("Ranger Incident Management System")
      ).toBeInTheDocument();
    }
  );

  test(
    "not found", async () => {
      renderWithURL("/xyzzy");

      expect(
        await screen.findByText(/Resource not found:/)
      ).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    }
  );

});
