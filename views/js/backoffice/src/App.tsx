import React, { Suspense } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";
import "./App.less";
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
      <ConfigProvider locale={esES}>
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            <Router>
              <Switch>
                <Route path="/auth">
                  <Auth />
                </Route>
                <Route exact path={`/tos`}>
                  <Tos />
                </Route>
                <PrivateRoute path="/">
                  <Dashboard />
                </PrivateRoute>
              </Switch>
            </Router>
          </Suspense>
        </AuthProvider>
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
