import React, { Suspense } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import "./App.css";
import Auth from "./pages/auth";
import PrivateRoute from "./components/molecules/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import client from "./lib/apolloClient";
import { AuthProvider } from "./lib/auth";
import Tos from "./pages/Tos";
import Loading from "./components/atoms/Loading";

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Switch>
            <Route path="/auth">
              <Suspense fallback={<Loading />}>
                <Auth />
              </Suspense>
            </Route>
            <Route exact path={`/tos`}>
              <Tos />
            </Route>
            <PrivateRoute path="/">
              <Dashboard />
            </PrivateRoute>
          </Switch>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
