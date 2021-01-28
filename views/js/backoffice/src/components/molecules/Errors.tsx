import React from "react";
import { Errors as IErrors } from "../../lib/auth";
import { Typography } from "antd";

const { Text } = Typography;

interface ErrorsProps {
  errors?: IErrors;
  fields?: string[];
}

const Error = ({ message }: { message: string }) => (
  <Text type="danger">{message}</Text>
);

const Errors = ({ errors, fields }: ErrorsProps) => {
  console.log(errors, fields);

  if (!errors) {
    return null;
  }
  return (
    <div>
      {errors.nonFieldErrors?.map((e) => (
        <Error key={e.code} message={e.message} />
      ))}
      {fields &&
        fields.map((field) =>
          errors[field]?.map((e) => <Error key={e.code} message={e.message} />)
        )}
    </div>
  );
};

export default Errors;
