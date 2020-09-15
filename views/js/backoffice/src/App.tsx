import React from "react";
import './App.css';
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Header } from "./components/organisms";
import Auth from "./pages/auth";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/">
          <Link to="/auth/login">Inicia sesión</Link>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
