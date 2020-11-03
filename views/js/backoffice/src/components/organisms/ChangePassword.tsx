import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Form, Input, Typography } from "antd";
import { PASSWORD_CHANGE } from "../../api/mutations";
import {
  PasswordChange,
  PasswordChangeVariables,
} from "../../api/types/PasswordChange";
import Errors from "../molecules/Errors";

const { Title, Text } = Typography;

const ChangePassword = () => {
  const [passwordChange, { loading, data }] = useMutation<
    PasswordChange,
    PasswordChangeVariables
  >(PASSWORD_CHANGE);
  return (
    <>
      <Title level={2}>Modificar contraseña</Title>
      <Errors errors={data?.passwordChange?.errors} />
      {data?.passwordChange?.success && (
        <Text type="success">Contraseña cambiada con éxito</Text>
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
          label="Contraseña actual"
          name="oldPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Nueva contraseña"
          name="newPassword1"
          rules={[{ required: true }, { min: 8 }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Repetir nueva contraseña"
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
            Cambiar contraseña
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
