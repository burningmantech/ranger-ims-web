import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  render() {
    return (
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home}/>
          </Switch>
        </Suspense>
      </Router>
    );
  }

}
