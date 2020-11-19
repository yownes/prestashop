import React from "react";
import { Link } from "react-router-dom";
import { Input } from "antd";

import styles from "./AdminHeader.module.css";
import { useTranslation } from "react-i18next";

const AdminHeader = () => {
  const { t } = useTranslation("admin");
  return (
    <div className={styles.container}>
      <div>
        <Link to="/clients">{t("clients")}</Link>
        <Link to="/builds">{t("builds")}</Link>
      </div>
      <div>
        <Input.Search />
      </div>
    </div>
  );
};

export default AdminHeader;
