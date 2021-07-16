import { Component } from "react";

import { IMSContext } from "../ims/context";

import BagTable from "../components/BagTable";
import Page from "../components/Page";


export default class AdminPage extends Component {

  static contextType = IMSContext;

  render = () => {
    return (
      <Page>
        <h1>AdminPage Console</h1>
        <BagTable />
      </Page>
    );
  }

}
