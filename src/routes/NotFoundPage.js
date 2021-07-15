import { Component } from "react";

import Page from "../components/Page";


export default class NotFoundPage extends Component {

  render = () => {
    return (
      <Page>
        Resource not found: <code>{window.location.href}</code>
      </Page>
    );
  }

}
