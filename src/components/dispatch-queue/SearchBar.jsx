import invariant from "invariant";

import Form from "react-bootstrap/Form";

import { SearchIcon } from "../icons";

const SearchBar = ({ searchInput, setSearchInput }) => {
  invariant(searchInput != null, "searchInput argument is required");
  invariant(setSearchInput != null, "setSearchInput argument is required");

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <Form.Group id="search_bar" controlId="search_input">
      <Form.Label size="sm">
        <SearchIcon />
      </Form.Label>
      <Form.Control
        type="search"
        placeholder="Search"
        value={searchInput}
        inputMode="latin"
        autoComplete="off"
        size="sm"
        onChange={handleSearchInput}
      />
    </Form.Group>
  );
};

export default SearchBar;
