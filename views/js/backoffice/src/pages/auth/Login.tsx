import React from "react";
import { Link } from "react-router-dom";
import Auth from "../../components/templates/Auth";

interface LoginProps {}

const Login = ({}: LoginProps) => {
  return (
    <Auth background="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1>Bienvenido</h1>
        <p>
          ¿Eres nuevo?
          <Link to={`/auth/register`}>Crear cuenta</Link>
        </p>
      </div>
    </Auth>
  );
};

export default Login;
