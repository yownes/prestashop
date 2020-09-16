import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Builds from "./Builds";
import Clients from "./Clients";

const AdminDashboard = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={{ pathname: "/clients" }} />
      </Route>
      <Route exact path={`/builds`}>
        <Builds />
      </Route>
      <Route exact path={`/clients`}>
        <Clients />
      </Route>
    </Switch>
  );
};

export default AdminDashboard;
