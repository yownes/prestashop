import React from "react";
import { Button, message, Popconfirm } from "antd";
import { useMutation } from "@apollo/client";
import { DELETE_APP, UPDATE_APP } from "../../api/mutations";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { UpdateApp, UpdateAppVariables } from "../../api/types/UpdateApp";
import { useHistory } from "react-router-dom";

import styles from "./AppPreview.module.css";
import { StoreAppInput } from "../../api/types/globalTypes";

interface AppPreviewProps {
  app: StoreAppInput;
  id: string;
  hasChanged: boolean;
}

const AppPreview = ({ id, app, hasChanged }: AppPreviewProps) => {
  const [deleteApp] = useMutation<DeleteApp, DeleteAppVariables>(DELETE_APP);
  const [updateApp] = useMutation<UpdateApp, UpdateAppVariables>(UPDATE_APP);
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
              variables: { id },
              update(cache, { data }) {
                if (data?.deleteApp?.ok) {
                  cache.evict({
                    id: cache.identify({
                      __typename: "StoreAppType",
                      __ref: id,
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
        {hasChanged && (
          <Button
            type="ghost"
            onClick={() => {
              const data = {  ...app  };
              // Don't send the image if it's not a Blob
              // If string, means the logo is the server URL
              if (typeof data.logo === "string") {
                delete data.logo;
              }
              updateApp({
                variables: {
                  id: id,
                  data,
                },
              });
            }}
          >
            Guardar cambios
          </Button>
        )}
        <Button type="primary">Publicar App</Button>
      </div>
    </div>
  );
};

export default AppPreview;
