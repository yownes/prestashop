import React, { useState } from "react";
import { Button, Form, Input, Popconfirm } from "antd";
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
}

const ProfileDangerZone = ({ id }: ProfileDangerZoneProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<IErrors>();
  const [deleteAccount] = useMutation<DeleteAccount, DeleteAccountVariables>(
    DELETE_ACCOUNT
  );
  const { logout } = useAuth();
  return (
    <div>
      <Errors errors={errors} />
      {confirmPassword && (
        <div>
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
            <Button htmlType="submit">Confirmar eliminación de cuenta</Button>
          </Form>
        </div>
      )}

      {isExpanded ? (
        <div>
          <Popconfirm
            title="¿Realmente deseas eliminar la cuenta?"
            placement="right"
            onConfirm={() => {
              setConfirmPassword(true);
            }}
          >
            <Button type="primary" danger>
              Eliminar cuenta
            </Button>
          </Popconfirm>
          <Button onClick={() => setIsExpanded(false)}>Cancelar</Button>
        </div>
      ) : (
        <Button
          type="ghost"
          size="small"
          danger
          onClick={() => setIsExpanded(true)}
        >
          Danger zone
        </Button>
      )}
    </div>
  );
};

export default ProfileDangerZone;
