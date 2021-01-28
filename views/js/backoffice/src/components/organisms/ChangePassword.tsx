import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Form, Input, Typography, message } from "antd";
import { PASSWORD_CHANGE } from "../../api/mutations";
import {
  PasswordChange,
  PasswordChangeVariables,
} from "../../api/types/PasswordChange";
import Errors from "../molecules/Errors";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/auth";

const { Title } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation("client");
  const { setNewToken } = useAuth();
  const [passwordChange, { loading, data }] = useMutation<
    PasswordChange,
    PasswordChangeVariables
  >(PASSWORD_CHANGE);
  message.config({
    maxCount: 1,
  });
  if (data?.passwordChange?.success) {
    form.resetFields();
    message.success(t("changePasswordSuccessful"), 4);
  }

  return (
    <>
      <Title level={2}>{t("changePassword")}</Title>
      <Errors
        errors={data?.passwordChange?.errors}
        fields={["oldPassword", "newPassword", "newPassword2"]}
      />
      <Form
        form={form}
        onFinish={(values) => {
          passwordChange({
            variables: {
              ...values,
            },
          }).then(({ data }) => {
            if (
              data?.passwordChange?.success &&
              data?.passwordChange?.token &&
              data?.passwordChange?.refreshToken
            ) {
              setNewToken?.(
                data.passwordChange.token,
                data.passwordChange.refreshToken
              );
            }
          });
        }}
      >
        <Form.Item
          label={t("oldPassword")}
          name="oldPassword"
          rules={[{ required: true, message: t("required.oldPassword") }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t("newPassword")}
          name="newPassword1"
          rules={[
            { required: true, message: t("required.newPassword") },
            { min: 8, message: t("required.minPassword", { num: 8 }) },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t("newPassword2")}
          name="newPassword2"
          rules={[
            { required: true, message: t("required.newPassword2") },
            { min: 8, message: t("required.minPassword", { num: 8 }) },
          ]}
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
