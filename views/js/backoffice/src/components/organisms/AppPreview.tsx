import React from "react";
import { Button, message, Popconfirm } from "antd";
import { useMutation } from "@apollo/client";
import { DELETE_APP, UPDATE_APP } from "../../api/mutations";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { UpdateApp, UpdateAppVariables } from "../../api/types/UpdateApp";
import { useHistory } from "react-router-dom";

import styles from "./AppPreview.module.css";
import { StoreAppInput } from "../../api/types/globalTypes";
import { Trans, useTranslation } from "react-i18next";

interface AppPreviewProps {
  app: StoreAppInput;
  id: string;
  hasChanged: boolean;
}

const AppPreview = ({ id, app, hasChanged }: AppPreviewProps) => {
  const { t } = useTranslation("client");
  const [deleteApp] = useMutation<DeleteApp, DeleteAppVariables>(DELETE_APP);
  const [updateApp] = useMutation<UpdateApp, UpdateAppVariables>(UPDATE_APP);
  const history = useHistory();
  return (
    <div className={styles.container}>
      <div className={styles.preview}></div>
      <div className={styles.buttons}>
        <Popconfirm
          title={
            <Trans i18nKey="warnings.app" ns="client">
              <div>¿Realmente deseas eliminar la App?</div>
              <div>Será retirada de la AppStore y PlayStore</div>
            </Trans>
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
                  message.success(t("appDeleted"));
                  history.replace("/profile");
                }
              },
            });
          }}
        >
          <Button type="primary" danger>
            {t("deleteApp")}
          </Button>
        </Popconfirm>
        {hasChanged && (
          <Button
            type="ghost"
            onClick={() => {
              const data = { ...app };
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
            {t("saveChanges")}
          </Button>
        )}
        <Button type="primary">{t("publishApp")}</Button>
      </div>
    </div>
  );
};

export default AppPreview;
