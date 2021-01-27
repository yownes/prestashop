import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./AppPreview.module.css";
import { StoreAppInput } from "../../api/types/globalTypes";
import { Typography } from "antd";

interface AppPreviewProps {
  app: StoreAppInput;
  id: string;
}

const AppPreview = ({ id, app }: AppPreviewProps) => {
  const { t } = useTranslation("client");
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Typography.Title level={2}>{t("preview")}</Typography.Title>
      </div>
      <div className={styles.previewContainer}>
        <div className={styles.preview}></div>
      </div>
    </div>
  );
};

export default AppPreview;
