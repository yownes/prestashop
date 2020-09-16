import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import Auth from "../../lib/auth";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }: RouteProps) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        Auth.getSingleton().isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/auth/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
