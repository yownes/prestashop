import React from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "antd";
import { getAppBuildState } from "../../lib/appBuildState";

import styles from "./AppInfo.module.css";
import BuildState from "./BuildState";
import ImageUpload from "./FileUpload";
import { StoreAppInput } from "../../api/types/globalTypes";
import { App_app } from "../../api/types/App";

const { Paragraph } = Typography;

interface AppInfoProps {
  id?: string;
  data: StoreAppInput;
  app?: App_app;
  onChange: (app: StoreAppInput) => void;
}

const AppInfo = ({ app, id, data, onChange }: AppInfoProps) => {
  const { t } = useTranslation("client");
  return (
    <div className={styles.info}>
      <div className={styles.info__logo}>
        <ImageUpload
          value={data.logo}
          onDeleteClicked={() => {
            onChange({
              ...data,
              logo: null,
            });
          }}
          onChange={(value) => {
            onChange({
              ...data,
              logo: value,
            });
          }}
        />
      </div>
      <h1 className={styles.info__appName}>
        <Paragraph
          editable={{
            onChange(value) {
              onChange({
                ...data,
                name: value,
              });
            },
          }}
        >
          {data.name !== "" ? data.name : t("noName")}
        </Paragraph>
      </h1>
      <h2 className={styles.info__appId}>{id}</h2>
      <div className={styles.info__stores}>
        {app?.storeLinks?.ios ? (
          <a className={styles.infoStores__link} href={app.storeLinks.ios}>
            iOS
          </a>
        ) : (
          <a href="*" className={styles.infoStores__link}>
            iOS
          </a>
        )}
        {app?.storeLinks?.android ? (
          <a className={styles.infoStores__link} href={app.storeLinks.android}>
            Android
          </a>
        ) : (
          <a href="*" className={styles.infoStores__link}>
            Android
          </a>
        )}
      </div>
      <div className={styles.info__state}>
        <BuildState state={getAppBuildState(app)} />
      </div>
    </div>
  );
};

export default AppInfo;
