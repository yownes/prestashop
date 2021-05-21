import React from "react";
import { Errors as IErrors } from "../../lib/auth";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const { Text } = Typography;

interface ErrorsProps {
  errors?: IErrors;
  fields?: string[];
}

const Error = ({ message }: { message: string }) => (
  <Text type="danger">{message} </Text>
);

const Errors = ({ errors, fields }: ErrorsProps) => {
  const { t } = useTranslation("auth");
  console.log(errors, fields);
  if (!errors) {
    return null;
  }
  return (
    <div>
      {errors.nonFieldErrors?.map((e) =>
        i18n.exists(`auth:auth_errors.${e.code}`) ? (
          <Error key={e.code} message={t(`auth_errors.${e.code}`)} />
        ) : (
          <Error key={e.code} message={e.message} />
        )
      )}
      {fields &&
        fields.map((field) =>
          errors[field]?.map((e) =>
            i18n.exists(`auth:auth_errors.${e.code}`) ? (
              <Error key={e.code} message={t(`auth_errors.${e.code}`)} />
            ) : (
              <Error key={e.code} message={e.message} />
            )
          )
        )}
    </div>
  );
};

export default Errors;
