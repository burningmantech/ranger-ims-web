import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { arrayOf, draw, randomSample, text } from "../../test/data";

import IncidentTypesCard from "./IncidentTypesCard";

describe("IncidentTypesCard component", () => {
  const _incidentTypeArrays = () => {
    return Array.from(
      draw(
        16,
        arrayOf(text({ minLength: 1, maxLength: 32 }), {
          minLength: 1,
          unique: true,
        }),
      ),
    );
  };

  const incidentTypeArrays = Array.from(_incidentTypeArrays());

  test.each(randomSample(incidentTypeArrays, 100))(
    "incident types displayed",
    (incidentTypes) => {
      if (incidentTypes != null) {
        render(<IncidentTypesCard incidentTypes={incidentTypes} />);

        const displayedIncidentTypes = Array.from(
          document.getElementsByClassName("list-group-item"),
          (item) => item.textContent,
        );

        expect(displayedIncidentTypes).toEqual(incidentTypes.sort());
      }
    },
  );
});
