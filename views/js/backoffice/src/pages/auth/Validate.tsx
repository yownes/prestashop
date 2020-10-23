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

interface ValidateParamTypes {
  token: string;
}

const Validate = () => {
  const location = useParams<ValidateParamTypes>();
  const [verifyAccount, { loading, data }] = useMutation<
    VerifyAccount,
    VerifyAccountVariables
  >(VERIFY_ACCOUNT);
  console.log(location);
  console.log({ loading, data });

  useEffect(() => {
    console.log("useEffect");

    verifyAccount({ variables: { token: location.token } });
  }, [location.token, verifyAccount]);
  if (loading) {
    return <div>Verificando cuenta...</div>;
  }
  return (
    <div>
      {data?.verifyAccount?.success && <h1>Cuenta validada correctamente</h1>}
      <Errors errors={data?.verifyAccount?.errors} />
      <Link to="/profile">
        <Button>Volver al Perfil</Button>
      </Link>
    </div>
  );
};

export default Validate;
