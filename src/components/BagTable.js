import { Component } from "react";

import Table from "react-bootstrap/Table";

import { IMSContext } from "../context";

import Loading from "../components/Loading";


export default class BagTable extends Component {

  static contextType = IMSContext;

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = () => {
    this.fetch();  // no await needed
  }

  fetch = async () => {
    const context = this.context;
    if (context === undefined) {
      throw new Error(`No context provided to ${this.constructor.name}.`);
    }

    const ims = context.ims;
    if (ims == null) {
      throw new Error(`No IMS provided to ${this.constructor.name}.`);
    }

    this.setState({ bag: await ims.bag() });
  }

  render = () => {
    const fullRow = (content) => {
      return <tr><td colSpan="2" className="text-center">{content}</td></tr>;
    }

    const rows = () => {
      const bag = this.state.bag;

      if (bag === undefined) {
        return fullRow(<Loading />);
      }

      if (bag.urls == null) {
        return fullRow("ERROR: no URLs in bag");
      }

      const link = (url) => {
        if (url.includes("<")) {
          return url;
        }
        else {
          return <a href={url}>{url}</a>;
        }
      }

      return Object.entries(bag.urls).map(
        ([name, url]) => {
          return (
            <tr key={name}>
              <td>{name}</td>
              <td>{link(url)}</td>
            </tr>
          );
        }
      );
    }

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
  }

}
