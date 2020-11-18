import React from "react";
import { useTranslation } from "react-i18next";

const Tos = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("tos.title")}</h1>
    </div>
  );
};

export default Tos;
