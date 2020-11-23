import { Component } from "react";

import Container from "react-bootstrap/Container";

import NavigationBar from "../components/Navbar";


export default class Home extends Component {

  render() {
    return (
      <Container id="page" fluid="false">
        <NavigationBar id="page_navigation" />
        {this.props.children}
      </Container>
    );
  }

}
