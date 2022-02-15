import invariant from "invariant";
import { useState } from "react";

import Table from "react-bootstrap/Table";

import { IMSContext } from "../ims/context";
import { useBag } from "../ims/effects";

import Loading from "../components/Loading";

const BagTable = () => {
  // Fetch data

  const [bag, setBag] = useState(undefined);

  useBag({ event: event, setBag: setBag });

  // Render

  const fullRow = (content) => {
    return (
      <tr>
        <td colSpan="2" className="text-center">
          {content}
        </td>
      </tr>
    );
  };

  const rows = () => {
    if (bag === undefined) {
      return fullRow(<Loading />);
    } else if (bag === null) {
      return fullRow("Error loading URL bag");
    }

    if (!bag.urls) {
      return fullRow("ERROR: no URLs in bag");
    }

    const link = (url) => {
      if (url.includes("{")) {
        return url;
      } else {
        return <a href={url}>{url}</a>;
      }
    };

    return Object.entries(bag.urls).map(([name, url]) => {
      return (
        <tr key={name}>
          <td>{name}</td>
          <td>{link(url)}</td>
        </tr>
      );
    });
  };

  return (
    <Table responsive striped bordered hover id="bag_table">
      <caption>IMS Bag</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>URL</th>
        </tr>
      </thead>
      <tbody>{rows()}</tbody>
    </Table>
  );
};

export default BagTable;
