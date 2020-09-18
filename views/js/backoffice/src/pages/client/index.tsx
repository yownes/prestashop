import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "../../lib/routes";

const ClientDashboard = () => {
  return (
    <Switch>
      {routes.map((MyRoute) => (
        <Route exact={MyRoute.exact} path={MyRoute.path}>
          {MyRoute.redirect ? (
            <Redirect to={{ pathname: MyRoute.redirect }} />
          ) : (
            MyRoute.component && <MyRoute.component />
          )}
        </Route>
      ))}
    </Switch>
  );
};

export default ClientDashboard;
