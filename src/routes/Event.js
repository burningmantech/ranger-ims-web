import { Component } from "react";

import Page from "../components/Page";


export default class Event extends Component {

  constructor(props) {
    if (props.id == null) {
      throw new Error("id is required");
    }

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
