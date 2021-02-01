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
        <Col lg={{ span: 4 }} md={{ span: 8 }} xs={{ span: 8 }}>
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
          <Typography.Text className={styles.info__appId}>
            ID: {id}
          </Typography.Text>
        </Col>
        <Col lg={{ span: 10 }} md={{ span: 16 }} xs={{ span: 16 }}>
          <Typography.Title className={styles.info__appName} level={2}>
            <Paragraph
              editable={{
                onChange(value) {
                  onChange({
                    ...data,
                    name: value === "" || value === t("noName") ? "" : value,
                  });
                },
              }}
              type={data.name ? undefined : "danger"}
            >
              {data.name !== "" ? data.name : t("noName")}
            </Paragraph>
          </Typography.Title>
          <Typography.Title level={5} className={styles.info__appiLink}>
            <Paragraph
              code
              editable={{
                onChange(value) {
                  onChange({
                    ...data,
                    apiLink: value === "" || value === t("noLink") ? "" : value,
                  });
                },
              }}
              type={data.apiLink ? undefined : "danger"}
            >
              {data.apiLink !== "" ? data.apiLink : t("noLink")}
            </Paragraph>
          </Typography.Title>
        </Col>
        <Col lg={{ span: 5 }} md={{ span: 8 }} xs={{ span: 8 }}>
          <Row justify="center">
            <BuildState state={getAppBuildState(app)} />
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
            </Col>
            <Col>
              <Typography.Text>-</Typography.Text>
            </Col>
            <Col>
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
        <Col lg={{ span: 5 }} md={{ span: 16 }} xs={{ span: 16 }}>
          <Row justify="center">
            <Space direction="vertical">
              <Button className={styles.info__button} type="primary">
                {t("client:publishApp")}
              </Button>
              <Button
                className={styles.info__button}
                disabled={!hasChanged || loadingUpdate}
                loading={loadingUpdate}
                type="ghost"
                onClick={() => {
                  if (data.apiLink === "" || data.name === "") {
                    message.error(t("client:saveChangesError"), 4);
                  } else {
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
                  }
                }}
              >
                {t("client:saveChanges")}
              </Button>
            </Space>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default AppInfo;
