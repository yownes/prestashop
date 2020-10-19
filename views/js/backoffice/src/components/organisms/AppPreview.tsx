import { Button } from "antd";
import React from "react";
import { AppGen } from "../../models/App";

import styles from "./AppPreview.module.css";

interface AppPreviewProps {
  app: AppGen;
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
