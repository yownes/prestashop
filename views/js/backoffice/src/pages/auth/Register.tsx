import React from "react";
import { Link } from "react-router-dom";
import Auth from "../../components/templates/Auth";

interface RegisterProps {}

const Register = ({}: RegisterProps) => {
  return (
    <Auth background="https://images.unsplash.com/photo-1586244439413-bc2288941dda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1>Crear una cuenta</h1>
        <p>
          ¿Ya tienes cuenta?
          <Link to={`/auth/login`}>Crear cuenta</Link>
        </p>
      </div>
    </Auth>
  );
};

export default Register;
