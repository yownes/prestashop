import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Auth from "../../components/templates/Auth";
import AuthLib from "../../lib/auth";
import { Form, Input, Button, Checkbox } from "antd";

import styles from "./auth.module.css";

interface LoginProps {}

interface LocationState {
  from: {
    pathname: string;
  };
}

const Login = ({}: LoginProps) => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  let { from } = location.state || { from: { pathname: "/" } };
  return (
    <Auth background="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>Bienvenido</h1>
        <p className={styles.centerText}>
          ¿Eres nuevo? <Link to={`/auth/register`}>Crear cuenta</Link>
        </p>
        <Form
          onFinish={(values) => {
            console.log("values", values);
            AuthLib.getSingleton().login(() => {
              AuthLib.getSingleton().setProfile({
                name: values.password,
                email: values.email,
                logo: "https://randomuser.me/api/portraits/men/13.jpg",
              });
              if (values.isAdmin) {
                AuthLib.getSingleton().makeAdmin(() => {
                  history.replace(from);
                });
              }
              history.replace(from);
            });
          }}
        >
          <Form.Item
            name="email"
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
          <Form.Item name="isAdmin" valuePropName="checked">
            <Checkbox>eres admin?</Checkbox>
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
