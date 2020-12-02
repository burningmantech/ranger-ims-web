import { Component } from "react";

import { IMSContext } from "../context";

import BagTable from "../components/BagTable";
import Page from "../components/Page";


export default class Admin extends Component {

  static contextType = IMSContext;

  render = () => {
    return (
      <Page>
        <h1>Admin Console</h1>
        <BagTable />
      </Page>
    );
  }

}
