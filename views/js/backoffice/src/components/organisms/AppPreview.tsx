import { Button } from "antd";
import React from "react";
import { App_app } from "../../api/types/App";

import styles from "./AppPreview.module.css";

interface AppPreviewProps {
  app: App_app;
}

const AppPreview = ({ app }: AppPreviewProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.preview}></div>
      <div className={styles.buttons}>
        <Button type="primary" danger>
          Eliminar App
        </Button>
        <Button type="primary">Publicar App</Button>
      </div>
    </div>
  );
};

export default AppPreview;
