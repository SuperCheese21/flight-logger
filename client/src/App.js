import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SearchBoxContainer from './SearchBox';

import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/data/:type?">
          <SearchBoxContainer />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
