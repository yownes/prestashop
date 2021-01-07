import React from "react";
import { Link } from "react-router-dom";
import Auth from "../../components/templates/Auth";
import { Form, Input, Button, notification } from "antd";

import styles from "./auth.module.css";
import { useTranslation } from "react-i18next";

const ForgottenPassword = () => {
  const { t } = useTranslation(["auth", "translation"]);
  return (
    <Auth image="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>{t("forgotPassword")}</h1>
        <Form
          onFinish={(values) => {
            //TODO: Send to server
            notification.open({
              message: t("forgotNotification.message"),
              description: t("forgotNotification.description"),
            });
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("required.email") },
              { type: "email", message: t("required.validEmail") },
            ]}
          >
            <Input placeholder={t("translation:email")} />
          </Form.Item>
          <div className={styles.buttons}>
            <Button block type="ghost">
              <Link to={`/auth/login`} style={{ display: "block" }}>
                {t("login")}
              </Link>
            </Button>
            <Button block type="primary" htmlType="submit">
              {t("sendMail")}
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default ForgottenPassword;
