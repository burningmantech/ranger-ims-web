import { render } from "@testing-library/react";

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
      if (items == null) {
        return;
      }

      render(<ItemListCard id="list" title="List of Items" items={items} />);

      const displayedItems = Array.from(
        document.getElementsByClassName("list-group-item"),
        (item) => item.textContent,
      );

      expect(displayedItems).toEqual(items.sort((a, b) => a.localeCompare(b)));
    },
  );
});
it("sorts with a custom sortFunction passed as a prop", () => {
  const items = [104, 57, 23, 23];
  render(
    <ItemListCard
      id="list"
      title="Sorted"
      items={items}
      sortFunc={(a, b) => b - a}
    />,
  );
  const displayedItems = Array.from(
    document.getElementsByClassName("list-group-item"),
    (item) => item.textContent,
  );
  expect(displayedItems).toEqual(["104", "57", "23", "23"]);
});
