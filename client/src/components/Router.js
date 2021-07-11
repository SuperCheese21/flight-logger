import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AddFlightPage, SearchBoxPage } from '../pages';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/add-flight">
        <AddFlightPage />
      </Route>
      <Route path="/data/:type?">
        <SearchBoxPage />
      </Route>
    </Switch>
  </BrowserRouter>
);
