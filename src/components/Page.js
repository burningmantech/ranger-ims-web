import Container from "react-bootstrap/Container";

import NavigationBar from "../components/nav/NavigationBar";


const Home = (props) => {
  return (
    <Container id="page" fluid>
      <NavigationBar id="page_navigation" />

      {props.children}

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

export default Home;
