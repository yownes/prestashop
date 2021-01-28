import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Button, Col, message, Row, Space, Typography } from "antd";
import { UPDATE_APP } from "../../api/mutations";
import { UpdateApp, UpdateAppVariables } from "../../api/types/UpdateApp";
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
  hasChanged: boolean;
}

const AppInfo = ({ app, id, data, onChange, hasChanged }: AppInfoProps) => {
  const { t } = useTranslation("client");
  const [updateApp, { loading: loadingUpdate, data: dataUpdate }] = useMutation<
    UpdateApp,
    UpdateAppVariables
  >(UPDATE_APP);
  message.config({
    maxCount: 1,
  });
  useEffect(() => {
    if (dataUpdate?.updateApp?.ok) {
      message.success(t("client:saveChangesSuccessful"), 4);
    }
  }, [dataUpdate, t]);
  return (
    <>
      <Row align="middle" justify="start">
        <Col>
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
        </Col>
        <Col offset="1" span="10">
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
          <h3 className={styles.info__appiLink}>
            <Paragraph
              editable={{
                onChange(value) {
                  console.log("value", value);
                  onChange({
                    ...data,
                    apiLink: value,
                  });
                },
              }}
            >
              {data.apiLink}
            </Paragraph>
          </h3>
        </Col>
        <Col span="5">
          <Row justify="center">
            <Col>
              <BuildState state={getAppBuildState(app)} />
            </Col>
          </Row>
          <Row justify="center">
            <Col>
              {app?.storeLinks?.ios ? (
                <a
                  className={styles.infoStores__link}
                  href={app.storeLinks.ios}
                >
                  iOS
                </a>
              ) : (
                <a href="*" className={styles.infoStores__link}>
                  iOS
                </a>
              )}
              -
              {app?.storeLinks?.android ? (
                <a
                  className={styles.infoStores__link}
                  href={app.storeLinks.android}
                >
                  Android
                </a>
              ) : (
                <a href="*" className={styles.infoStores__link}>
                  Android
                </a>
              )}
            </Col>
          </Row>
        </Col>
        <Col span="5">
          <Row justify="end">
            <Space direction="vertical">
              <Button className={styles.info__button} type="primary">
                {t("client:publishApp")}
              </Button>
              {hasChanged && (
                <Button
                  className={styles.info__button}
                  disabled={loadingUpdate}
                  loading={loadingUpdate}
                  type="ghost"
                  onClick={() => {
                    const dataApp = { ...data };
                    // Don't send the image if it's not a Blob
                    // If string, means the logo is the server URL
                    if (typeof dataApp.logo === "string") {
                      delete dataApp.logo;
                    }
                    updateApp({
                      variables: {
                        id: id!!,
                        data: dataApp,
                      },
                      update(cache, { data }) {
                        if (data?.updateApp?.ok) {
                          cache.modify({
                            id: cache.identify({ ...app }),
                            fields: {
                              name() {
                                return dataApp.name;
                              },
                              apiLink() {
                                return dataApp.apiLink;
                              },
                              color(old) {
                                return { ...old, ...dataApp.color };
                              },
                              logo() {
                                return dataApp.logo;
                              },
                              template(old, { toReference }) {
                                return toReference({
                                  __typename: "TemplateType",
                                  id: dataApp.template,
                                });
                              },
                            },
                          });
                        }
                      },
                    });
                  }}
                >
                  {t("client:saveChanges")}
                </Button>
              )}
            </Space>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default AppInfo;
