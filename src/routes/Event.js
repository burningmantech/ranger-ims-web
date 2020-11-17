import { Component } from "react";


export default class Event extends Component {

  constructor(props) {
    if (props.id === undefined) {
      throw new Error("id is not defined");
    }

    super(props);
  }

  render() {
    return (
      <h1>Event: {this.props.id}</h1>
    );
  }

}
