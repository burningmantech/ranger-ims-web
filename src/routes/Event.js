import invariant from "invariant";
import { Component } from "react";

import Page from "../components/Page";


export default class Event extends Component {

  constructor(props) {
    invariant(props.id != null, "id is required");

    super(props);
  }

  render = () => {
    return (
      <Page>
        <h1>Event: {this.props.id}</h1>
      </Page>
    );
  }

}
