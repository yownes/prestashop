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
      <Row align="middle" justify="start" gutter={[20, 20]}>
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
          <Space direction="vertical" size="middle">
            <Row>
              <BuildState state={getAppBuildState(app)} />
            </Row>
            <Row>
              <Col>
                {app?.storeLinks?.ios ? (
                  <a
                    href={app.storeLinks.ios}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    iOS
                  </a>
                ) : (
                  <Typography.Text disabled>iOS</Typography.Text>
                )}
              </Col>
              <Col>
                <Typography.Text className={styles.infoStores__link}>
                  -
                </Typography.Text>
              </Col>
              <Col>
                {app?.storeLinks?.android ? (
                  <a
                    href={app.storeLinks.android}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Android
                  </a>
                ) : (
                  <Typography.Text disabled>Android</Typography.Text>
                )}
              </Col>
            </Row>
          </Space>
        </Col>
        <Col lg={{ span: 5 }} md={{ span: 16 }} xs={{ span: 16 }}>
          <Row>
            <Space direction="vertical" size="middle">
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
                        } else {
                          message.error(
                            t(`appErrors.${data?.updateApp?.error}`) || "Error",
                            4
                          );
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
