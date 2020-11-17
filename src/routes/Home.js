import { Component } from "react";


export default class Home extends Component {

  constructor(props) {
    if (props.user === undefined) {
      throw new Error("user is not defined");
    }
    if (props.user === null) {
      throw new Error("user is null");
    }

    super(props);
  }

  render() {
    return (
      <>
        <h1>Ranger Incident Management System</h1>
        ...
      </>
    );
  }

}
