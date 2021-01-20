import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../NotFound";
import ForgottenPassword from "./ForgottenPassword";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  return (
    <Switch>
      <Route path={`/auth/login`}>
        <Login />
      </Route>
      <Route path={`/auth/register`}>
        <Register />
      </Route>
      <Route path={`/auth/password`}>
        <ForgottenPassword />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Auth;
