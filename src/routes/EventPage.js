import invariant from "invariant";
import { Component } from "react";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";
import Page from "../components/Page";


export default class EventPage extends Component {

  static contextType = IMSContext;

  constructor(props) {
    invariant(props.id != null, "id is required");

    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this._setEvent = (event) => { this.setState({ event: event }) };
    this.fetch();  // no await needed
  }

  componentWillUnmount = () => {
    this._setEvent = (event) => {
      console.debug(
        `Received event after ${this.constructor.name} unmounted.`
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
    invariant (ims != null, `No IMS provided to ${this.constructor.name}.`);

    let event;
    try {
      event = await ims.eventWithID(this.props.id);
    }
    catch (e) {
      console.error(`Unable to load ${this.constructor.name}: ${e.message}`);
      event = null;
    }

    this._setEvent(event);
  }

  render = () => {
    const event = this.state.event;

    if (event === undefined) {
      return <Loading />;
    } else if (event === null) {
      return "Error loading event";
    }

    return (
      <Page>
        <h1>Event: {event.name}</h1>
      </Page>
    );
  }

}
