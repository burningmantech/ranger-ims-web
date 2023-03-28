import Container from "react-bootstrap/Container";

import NavigationBar from "./nav/NavigationBar";

const Home = ({ children }) => {
  return (
    <Container id="page" fluid>
      <NavigationBar id="page_navigation" />

      {children}

      <footer>
        <hr />
        <p>
          IMS Software © Burning Man Project and its contributors. Data in IMS
          is confidential and proprietary.
        </p>
      </footer>
    </Container>
  );
};

export default Home;
