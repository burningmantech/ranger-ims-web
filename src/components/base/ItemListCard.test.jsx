import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { arrayOf, draw, randomSample, text } from "../../test/data";

import ItemListCard from "./ItemListCard";

describe("ItemListCard component", () => {
  const _itemArrays = () => {
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

  const itemArrays = Array.from(_itemArrays());

  test.each(randomSample(itemArrays, 100))(
    "incident types displayed",
    (items) => {
      if (items != null) {
        render(<ItemListCard id="list" title="List of Items" items={items} />);

        const displayedItems = Array.from(
          document.getElementsByClassName("list-group-item"),
          (item) => item.textContent,
        );

        expect(displayedItems).toEqual(items.sort());
      }
    },
  );
});
