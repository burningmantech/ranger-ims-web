import { useState } from "react";

import Table from "react-bootstrap/Table";

import { useBag } from "../ims/effects";

import Loading from "../components/Loading";

const BagTable = () => {
  // Fetch data

  const [bag, setBag] = useState(undefined);

  useBag({ setBag: setBag });

  const urls = bag ? bag.urls : null;

  // Render

  // const fullRow = (content) => {
  //   return (
  //     <tr>
  //       <td colSpan="2" className="text-center">
  //         {content}
  //       </td>
  //     </tr>
  //   );
  // };

  const rows = () => {
    const link = (url) => {
      if (url.includes("{")) {
        return url;
      } else {
        return <a href={url}>{url}</a>;
      }
    };

    return urls
      ? Object.entries(urls).map(([name, url]) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{link(url)}</td>
          </tr>
        ))
      : null;
  };

  return (
    <Loading condition={bag} error={bag === null} what={"URL bag"}>
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
    </Loading>
  );
};

export default BagTable;
