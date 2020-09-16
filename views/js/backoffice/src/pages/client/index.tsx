import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Profile from "./Profile";
import Config from "./Config";
import Pay from "./Pay";

const ClientDashboard = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={{ pathname: "/profile" }} />
      </Route>
      <Route exact path={`/profile`}>
        <Profile />
      </Route>
      <Route exact path={`/config`}>
        <Config />
      </Route>
      <Route exact path={`/pay`}>
        <Pay />
      </Route>
    </Switch>
  );
};

export default ClientDashboard;
