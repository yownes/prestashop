import React from "react";
import { Typography } from "antd";
import { getAppBuildState } from "../../lib/appBuildState";
import { AppGen } from "../../models/App";

import styles from "./AppInfo.module.css";
import BuildState from "./BuildState";

const { Paragraph } = Typography;

interface AppInfoProps {
  app: AppGen;
  onChange: (app: AppGen) => void;
}

const AppInfo = ({ app, onChange }: AppInfoProps) => {
  return (
    <div className={styles.info}>
      <div className={styles.info__logo}>
        <img
          src="https://playbaikoh.com/wp-content/uploads/2015/05/Game_icon_skull_BAIKOH_perfil.png"
          width={120}
          height={120}
        />
      </div>
      <h1 className={styles.info__appName}>
        <Paragraph
          editable={{
            onChange(value) {
              onChange({
                ...app,
                name: value,
              });
            },
          }}
        >
          {app.name ?? "(Sin nombre)"}
        </Paragraph>
      </h1>
      <h2 className={styles.info__appId}>{app.id}</h2>
      <div className={styles.info__stores}>
        {app.storeLinks?.ios && (
          <a className={styles.infoStores__link} href={app.storeLinks?.ios}>
            iOS
          </a>
        )}
        {app.storeLinks?.android && (
          <a className={styles.infoStores__link} href={app.storeLinks?.android}>
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
