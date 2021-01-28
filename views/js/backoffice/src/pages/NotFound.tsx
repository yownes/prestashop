import React from "react";
import { Card, Result } from "antd";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation("");
  return (
    <Card>
      <Result status="404" title={t("404title")} subTitle={t("404subTitle")} />
    </Card>
  );
};

export default NotFound;
