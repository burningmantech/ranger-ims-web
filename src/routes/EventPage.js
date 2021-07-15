import invariant from "invariant";
import { Component } from "react";
import { withRouter } from "react-router-dom";

import { IMSContext } from "../ims/context";

import Loading from "../components/Loading";
import Page from "../components/Page";


export class EventPage extends Component {

  static contextType = IMSContext;

  constructor(props) {
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

  eventID = () => {
    invariant(this.props.id != null, "id property is required");
    return this.props.id;
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
      event = await ims.eventWithID(this.eventID());
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


class RoutedEventPage extends EventPage {

  eventID = () => {
    invariant(this.props.match != null, "match property is required");
    invariant(
      this.props.match.params != null, "match.params property is required"
    );
    invariant(
      this.props.match.params.eventID != null,
      "match.params.eventID property is required",
    );
    return this.props.match.params.eventID;
  }

}


export default withRouter(RoutedEventPage);
