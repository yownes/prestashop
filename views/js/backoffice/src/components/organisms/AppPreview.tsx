import React from "react";
import { Button, message, Popconfirm } from "antd";
import { useMutation } from "@apollo/client";
import { App_app } from "../../api/types/App";
import { DELETE_APP } from "../../api/mutations";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { useHistory } from "react-router-dom";

import styles from "./AppPreview.module.css";

interface AppPreviewProps {
  app: App_app;
}

const AppPreview = ({ app }: AppPreviewProps) => {
  const [deleteApp] = useMutation<DeleteApp, DeleteAppVariables>(DELETE_APP);
  const history = useHistory();
  return (
    <div className={styles.container}>
      <div className={styles.preview}></div>
      <div className={styles.buttons}>
        <Popconfirm
          title={
            <>
              <div>¿Realmente deseas eliminar la App?</div>
              <div>Será retirada de la AppStore y PlayStore</div>
            </>
          }
          onConfirm={() => {
            deleteApp({
              variables: { id: app.id },
              update(cache, { data }) {
                if (data?.deleteApp?.ok) {
                  cache.evict({
                    id: cache.identify({
                      __typename: app.__typename,
                      __ref: app.id,
                    }),
                  });
                  cache.gc();
                  message.success("La App ha sido eliminada correctamente");
                  history.replace("/profile");
                }
              },
            });
          }}
        >
          <Button type="primary" danger>
            Eliminar App
          </Button>
        </Popconfirm>
        <Button type="primary">Publicar App</Button>
      </div>
    </div>
  );
};

export default AppPreview;
