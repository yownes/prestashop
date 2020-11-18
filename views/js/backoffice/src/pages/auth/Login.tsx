import React from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import Auth from "../../components/templates/Auth";
import { useAuth } from "../../lib/auth";
import { Form, Input, Button } from "antd";

import styles from "./auth.module.css";
import Errors from "../../components/molecules/Errors";
import { useTranslation } from "react-i18next";

interface LocationState {
  from: {
    pathname: string;
  };
}

const Login = () => {
  const location = useLocation<LocationState>();
  const { t } = useTranslation("auth");
  let { from } = location.state || { from: { pathname: "/" } };
  const { login, isAuthenticated, errors } = useAuth();
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }
  return (
    <Auth image="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>{t("welcome")}</h1>
        <Errors errors={errors} fields={["email", "password"]} />
        <Form
          onFinish={(values) => {
            login?.({ password: values.password, email: values.email });
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("required.mail") },
              { type: "email" },
            ]}
          >
            <Input placeholder={t("email")} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t("required.password") }]}
          >
            <Input.Password placeholder={t("password")} />
          </Form.Item>
          <Link to={`/auth/password`} className={styles.rightAlign}>
            {t("forgotPassword")}
          </Link>
          <div className={styles.buttons}>
            <Button block type="ghost">
              <Link to={`/auth/register`} style={{ display: "block" }}>
                {t("createAccount")}
              </Link>
            </Button>
            <Button block type="primary" htmlType="submit">
              {t("connect")}
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default Login;
