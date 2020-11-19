import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Form, Input, Typography } from "antd";
import { PASSWORD_CHANGE } from "../../api/mutations";
import {
  PasswordChange,
  PasswordChangeVariables,
} from "../../api/types/PasswordChange";
import Errors from "../molecules/Errors";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const ChangePassword = () => {
  const { t } = useTranslation("client");
  const [passwordChange, { loading, data }] = useMutation<
    PasswordChange,
    PasswordChangeVariables
  >(PASSWORD_CHANGE);
  return (
    <>
      <Title level={2}>{t("changePassword")}</Title>
      <Errors errors={data?.passwordChange?.errors} />
      {data?.passwordChange?.success && (
        <Text type="success">{t("changePasswordSuccessful")}</Text>
      )}
      <Form
        onFinish={(values) => {
          passwordChange({
            variables: {
              ...values,
            },
          });
        }}
      >
        <Form.Item
          label={t("oldPassword")}
          name="oldPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t("newPassword")}
          name="newPassword1"
          rules={[{ required: true }, { min: 8 }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t("newPassword2")}
          name="newPassword2"
          rules={[{ required: true }, { min: 8 }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            disabled={loading}
            loading={loading}
          >
            {t("changePassword")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
