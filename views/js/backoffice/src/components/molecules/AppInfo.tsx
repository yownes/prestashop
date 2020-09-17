import React from "react";
import { getAppBuildState } from "../../lib/appBuildState";
import { App } from "../../models/App";

import styles from "./AppInfo.module.css";
import BuildState from "./BuildState";

interface AppInfoProps {
  app: App;
}

const AppInfo = ({ app }: AppInfoProps) => {
  return (
    <div className={styles.info}>
      <div className={styles.info__logo}>
        <img
          src="https://playbaikoh.com/wp-content/uploads/2015/05/Game_icon_skull_BAIKOH_perfil.png"
          width={120}
          height={120}
        />
      </div>
      <h1 className={styles.info__appName}>{app.name}</h1>
      <h2 className={styles.info__appId}>{app.id}</h2>
      <div className={styles.info__stores}>
        <a className={styles.infoStores__link} href={app.urls?.ios}>
          iOS
        </a>
        <a className={styles.infoStores__link} href={app.urls?.android}>
          Android
        </a>
      </div>
      <div className={styles.info__state}>
        <BuildState state={getAppBuildState(app)} />
      </div>
    </div>
  );
};

export default AppInfo;
