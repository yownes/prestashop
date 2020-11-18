import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { VERIFY_ACCOUNT } from "../../api/mutations";
import {
  VerifyAccount,
  VerifyAccountVariables,
} from "../../api/types/VerifyAccount";
import Errors from "../../components/molecules/Errors";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

interface ValidateParamTypes {
  token: string;
}

const Validate = () => {
  const location = useParams<ValidateParamTypes>();
  const { t } = useTranslation("auth");
  const [verifyAccount, { loading, data }] = useMutation<
    VerifyAccount,
    VerifyAccountVariables
  >(VERIFY_ACCOUNT);

  useEffect(() => {
    verifyAccount({ variables: { token: location.token } });
  }, [location.token, verifyAccount]);
  if (loading) {
    return <div>Verificando cuenta...</div>;
  }
  return (
    <div>
      {data?.verifyAccount?.success && <h1>{t("successfulValidation")}</h1>}
      <Errors errors={data?.verifyAccount?.errors} />
      <Link to="/profile">
        <Button>{t("backToProfile")}</Button>
      </Link>
    </div>
  );
};

export default Validate;
