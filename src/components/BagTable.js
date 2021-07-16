import invariant from "invariant";
import { Component } from "react";

import Table from "react-bootstrap/Table";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";


export default class BagTable extends Component {

  static contextType = IMSContext;

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = () => {
    this._setBag = (bag) => { this.setState({ bag: bag }) };
    this.fetch();  // no await needed
  }

  componentWillUnmount = () => {
    this._setBag = (bag) => {
      console.debug(
        `Received bag after ${this.constructor.name} unmounted.`
      );
    };
  }

  fetch = async () => {
    const context = this.context;
    invariant(
      context !== undefined,
      `No context provided to ${this.constructor.name}.`,
    );

    const ims = context.ims;
    invariant(ims != null, `No IMS provided to ${this.constructor.name}.`);

    let bag;
    try {
      bag = await ims.bag();
    }
    catch (e) {
      console.error(`Unable to load ${this.constructor.name}: ${e.message}`);
      bag = null;
    }

    this._setBag(bag);
  }

  render = () => {
    const fullRow = (content) => {
      return <tr><td colSpan="2" className="text-center">{content}</td></tr>;
    }

    const rows = () => {
      const bag = this.state.bag;

      if (bag === undefined) {
        return fullRow(<Loading />);
      } else if (bag === null) {
      return fullRow("Error loading URL bag");
    }

      if (! bag.urls) {
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
