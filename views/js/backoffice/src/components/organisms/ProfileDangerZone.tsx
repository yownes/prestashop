import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { useMutation } from "@apollo/client";
import { Errors as IErrors, useAuth } from "../../lib/auth";
import {
  DeleteAccount,
  DeleteAccountVariables,
} from "../../api/types/DeleteAccount";
import { DELETE_ACCOUNT } from "../../api/mutations";
import Errors from "../molecules/Errors";
import { useTranslation } from "react-i18next";

interface ProfileDangerZoneProps {
  id: string;
  confirmPassword: boolean;
}

const ProfileDangerZone = ({ id, confirmPassword }: ProfileDangerZoneProps) => {
  const [errors, setErrors] = useState<IErrors>();
  const [deleteAccount] = useMutation<DeleteAccount, DeleteAccountVariables>(
    DELETE_ACCOUNT
  );
  const {t} = useTranslation("client");
  const { logout } = useAuth();
  if (!confirmPassword) {
    return null;
  }
  return (
    <div>
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
          label={t("confirmPasswordDelete")}
        >
          <Input.Password />
        </Form.Item>
        <Button htmlType="submit" type="primary" danger>
          {t("confirmDeleteAccount")}
        </Button>
      </Form>
    </div>
  );
};

export default ProfileDangerZone;
