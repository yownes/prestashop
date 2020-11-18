import React from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import Auth from "../../components/templates/Auth";
import { Form, Input, Button, Checkbox } from "antd";

import styles from "./auth.module.css";
import { useAuth } from "../../lib/auth";
import Errors from "../../components/molecules/Errors";
import { Trans, useTranslation } from "react-i18next";

interface LocationState {
  from: {
    pathname: string;
  };
}

const Register = () => {
  const location = useLocation<LocationState>();
  const {t} = useTranslation("auth");
  let { from } = location.state || { from: { pathname: "/" } };
  const { register, isAuthenticated, errors } = useAuth();
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }
  return (
    <Auth image="https://images.unsplash.com/photo-1586244439413-bc2288941dda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>{t("createAnAccount")}</h1>
        <Errors errors={errors} fields={["email", "password1", "password2"]} />
        <Form
          onFinish={(values) => {
            register?.({
              email: values.email,
              username: values.name,
              password1: values.password,
              password2: values.confirmPassword,
            });
          }}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: t("required.name") },
              { min: 2, message: t("required.min", { num: 2 }) },
            ]}
          >
            <Input placeholder={t("name")} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("required.email") },
              { type: "email" },
            ]}
          >
            <Input placeholder={t("email")} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: t("required.password") },
              {
                min: 8,
                message: t("required.minPassword", {num: 8}),
              },
            ]}
          >
            <Input.Password placeholder={t("password")} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: t("required.passwordMatch") },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t("required.passwordMatch"));
                },
              }),
            ]}
            dependencies={["password"]}
          >
            <Input.Password placeholder={t("confirmPassword")} />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        t("required.tos")
                      ),
              },
            ]}
          >
            <Checkbox>
              <Trans i18nKey="acceptTos" ns="auth">
                Acepto los <Link to="/tos">Términos y Condiciones</Link>
              </Trans>
            </Checkbox>
          </Form.Item>
          <div className={styles.buttons}>
            <Button block type="ghost">
              <Link to={`/auth/login`}>{t("connect")}</Link>
            </Button>
            <Button block type="primary" htmlType="submit">
              {t("createAccount")}
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default Register;
