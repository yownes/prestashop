import React from "react";
import { Link } from "react-router-dom";
import Auth from "../../components/templates/Auth";
import { Form, Input, Button, notification } from "antd";

import styles from "./auth.module.css";

const ForgottenPassword = () => {
  return (
    <Auth image="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>Olvidaste la contraseña</h1>
        <Form
          onFinish={(values) => {
            //TODO: Send to server
            notification.open({
              message: "Recuperar contraseña",
              description:
                " Se ha enviado al mail un correo de recuperación de la contraseña. Pincha en el enlace del correo para crear una nueva.",
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
          <div className={styles.buttons}>
            <Button block type="ghost">
              <Link to={`/auth/login`} style={{ display: "block" }}>
                Iniciar sesión
              </Link>
            </Button>
            <Button block type="primary" htmlType="submit">
              Enviar correo
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default ForgottenPassword;
