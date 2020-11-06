import React, { useState } from "react";
import { Button, Divider, Form, Input, Popconfirm } from "antd";
import { useMutation } from "@apollo/client";
import { Errors as IErrors, useAuth } from "../../lib/auth";
import {
  DeleteAccount,
  DeleteAccountVariables,
} from "../../api/types/DeleteAccount";
import { DELETE_ACCOUNT } from "../../api/mutations";
import Errors from "../molecules/Errors";

interface ProfileDangerZoneProps {
  id: string;
  confirmPassword: boolean;
}

const ProfileDangerZone = ({ id, confirmPassword }: ProfileDangerZoneProps) => {
  const [errors, setErrors] = useState<IErrors>();
  const [deleteAccount] = useMutation<DeleteAccount, DeleteAccountVariables>(
    DELETE_ACCOUNT
  );
  const { logout } = useAuth();
  if (!confirmPassword) {
    return null;
  }
  return (
    <div>
      <Divider />
      <Errors errors={errors} fields={["password"]} />
      <Form
        onFinish={(values) => {
          deleteAccount({ variables: { password: values.password } }).then(
            ({ data }) => {
              if (data?.deleteAccount?.success) {
                logout?.();
              } else {
                setErrors(data?.deleteAccount?.errors);
              }
            }
          );
        }}
      >
        <Form.Item
          name="password"
          label="Confirmar contraseña para eliminar la cuenta"
        >
          <Input.Password />
        </Form.Item>
        <Button htmlType="submit" type="primary" danger>
          Confirmar eliminación de cuenta
        </Button>
      </Form>
    </div>
  );
};

export default ProfileDangerZone;
