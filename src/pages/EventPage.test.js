import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";

import { EventPage } from "./EventPage";

describe("EventPage component", () => {
  test("redirect to queue", async () => {
    const DispatchQueuePage = () => {
      const params = useParams();
      return <p>{params.eventID}</p>;
    };

    const eventID = "rad_event_of_awesome";

    render(
      <MemoryRouter initialEntries={[`/events/${eventID}/`]}>
        <Routes>
          {/* Event Page */}
          <Route path={"/events/:eventID/"} element={<EventPage />} />

          {/* Dispatch Queue Page */}
          <Route
            path={"/events/:eventID/queue"}
            element={<DispatchQueuePage />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Same expectations as for /ims (see next test)
    expect(screen.queryByText(eventID)).toBeInTheDocument();
  });
});
