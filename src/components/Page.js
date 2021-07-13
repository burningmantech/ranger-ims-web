import { Component } from "react";

import Container from "react-bootstrap/Container";

import NavigationBar from "../components/nav/NavigationBar";


export default class Home extends Component {

  render = () => {
    return (
      <Container id="page" fluid>
        <NavigationBar id="page_navigation" />

        {this.props.children}

        <footer>
        <hr />
        <p>
          IMS Software © 2013-2021 Burning Man and its contributors.
          Data in IMS is confidential and proprietary.
        </p>
        </footer>
      </Container>
    );
  }

}
