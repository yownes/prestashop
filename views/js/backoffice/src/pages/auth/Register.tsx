import React from "react";
import { Link } from "react-router-dom";
import Auth from "../../components/templates/Auth";
import { Form, Input, Button, Checkbox } from "antd";

import styles from "./auth.module.css";

const Register = () => {
  return (
    <Auth image="https://images.unsplash.com/photo-1586244439413-bc2288941dda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>Crear una cuenta</h1>
        <Form>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Introduce tu nombre" },
              { min: 2, message: "Introduce al menos dos caracteres" },
            ]}
          >
            <Input placeholder="Nombre" />
          </Form.Item>
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
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Las contraseñas deben coincidir" },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Las contraseñas deben coincidir");
                },
              }),
            ]}
            dependencies={["password"]}
          >
            <Input.Password placeholder="Confirmar contraseña" />
          </Form.Item>
          <Form.Item
            name="agreement"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        "Debes aceptar los Términos y Condiciones"
                      ),
              },
            ]}
          >
            <Checkbox>Acepto los Términos y Condiciones</Checkbox>
          </Form.Item>
          <div className={styles.buttons}>
            <Button block type="ghost">
              <Link to={`/auth/login`}>Conectarse</Link>
            </Button>
            <Button block type="primary" htmlType="submit">
              Crear cuenta
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default Register;
