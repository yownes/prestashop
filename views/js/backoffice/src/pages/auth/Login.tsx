import React from "react";
import { Link, useHistory } from "react-router-dom";
import Auth from "../../components/templates/Auth";
import AuthLib from "../../lib/auth";
import { Form, Input, Button } from "antd";

import styles from "./auth.module.css";

interface LoginProps {}

const Login = ({}: LoginProps) => {
  const history = useHistory();
  return (
    <Auth background="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>Bienvenido</h1>
        <p className={styles.centerText}>
          ¿Eres nuevo? <Link to={`/auth/register`}>Crear cuenta</Link>
        </p>
        <Form
          onFinish={() => {
            AuthLib.getSingleton().login(() => {
              history.replace("/");
            });
          }}
        >
          <Form.Item
            name="mail"
            rules={[
              { required: true, message: "Introduce tu mail" },
              { type: "email" },
            ]}
          >
            <Input placeholder="Mail" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Introduce una contraseña" }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Conectarse
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Auth>
  );
};

export default Login;
