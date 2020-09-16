import React from "react";
import './App.css';
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Header } from "./components/organisms";
import Auth from "./pages/auth";
import PrivateRoute from "./components/molecules/PrivateRoute";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <PrivateRoute path="/">
          <Link to="/auth/login">Inicia sesión</Link>
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
