import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";
import {
  Button,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { UPDATE_APP } from "../../api/mutations";
import { UpdateApp, UpdateAppVariables } from "../../api/types/UpdateApp";
import { getAppBuildState } from "../../lib/appBuildState";

import styles from "./AppInfo.module.css";
import BuildState from "./BuildState";
import ImageUpload from "./FileUpload";
import { StoreAppInput } from "../../api/types/globalTypes";
import { App_app, App_app_builds_edges_node } from "../../api/types/App";
import { BUILS_ALLOWED_BY_YEAR } from "../../data/variables";
import format from "date-fns/format";
import connectionToNodes from "../../lib/connectionToNodes";
import filter from "lodash/filter";
import find from "lodash/find";

const { Paragraph } = Typography;

interface AppInfoProps {
  id?: string;
  data: StoreAppInput;
  app?: App_app;
  onChange: (app: StoreAppInput) => void;
  hasChanged: boolean;
}

function addYearToDate(date: Date, num: number) {
  const newDate = new Date(
    new Date(date).setFullYear(new Date(date).getFullYear() + num)
  );
  return newDate;
}
function getRenewalBuild(builds: App_app_builds_edges_node[]) {
  return find(
    builds,
    (build) =>
      addYearToDate(new Date(build.date), -1) <= new Date() &&
      new Date(build.date) >= addYearToDate(new Date(), -1)
  );
}
function getRenewalDate(date: Date) {
  let renewal = false;
  let n = 0;
  let renewalDate = new Date();

  while (!renewal) {
    console.log("while");
    renewalDate = addYearToDate(date, n++);
    renewal = date <= new Date() && new Date() <= renewalDate;
  }
  return renewalDate;
}
function countCurrentBuilds(
  builds: App_app_builds_edges_node[],
  date: Date | undefined
) {
  let currentBuilds = date
    ? filter(
        builds,
        (build) => addYearToDate(date, -1) <= build.date && build.date <= date
      )
    : [];
  return currentBuilds.length;
}

const AppInfo = ({ app, id, data, onChange, hasChanged }: AppInfoProps) => {
  const { t } = useTranslation(["translation", "client"]);
  const [limitExceded, setLimitExceded] = useState(false);
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
  const builds = connectionToNodes(app?.builds);
  const renewalBuild = getRenewalBuild(builds);
  const renewalDate = renewalBuild
    ? getRenewalDate(new Date(renewalBuild?.date))
    : undefined;
  const currentBuilds = countCurrentBuilds(
    connectionToNodes(app?.builds),
    renewalDate
  );
  const remainingBuilds = BUILS_ALLOWED_BY_YEAR - currentBuilds;
  return (
    <>
      <Tooltip
        placement="left"
        title={
          <>
            <span>
              {t("client:warnings.buildsLimit", { num: BUILS_ALLOWED_BY_YEAR })}
            </span>
            <br />
            <span>
              {t("client:warnings.buildsRemaining", {
                num: remainingBuilds,
              })}
            </span>
            <br />
            {renewalDate ? (
              <span>
                {t("client:warnings.buildsRenewal", {
                  num: format(renewalDate, "dd/MM/yyyy"),
                }).replaceAll("&#x2F;", "/")}
              </span>
            ) : (
              <span>{t("client:warnings.buildsNoRenewal")}</span>
            )}
          </>
        }
      >
        <QuestionCircleOutlined className={styles.info__icon} />
      </Tooltip>
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
                    name:
                      value === "" || value === t("client:noName") ? "" : value,
                  });
                },
              }}
              type={data.name ? undefined : "danger"}
            >
              {data.name !== "" ? data.name : t("client:noName")}
            </Paragraph>
          </Typography.Title>
          <Typography.Title level={5} className={styles.info__appiLink}>
            <Paragraph
              code
              editable={{
                onChange(value) {
                  onChange({
                    ...data,
                    apiLink:
                      value === "" || value === t("client:noLink") ? "" : value,
                  });
                },
              }}
              type={data.apiLink ? undefined : "danger"}
            >
              {data.apiLink !== "" ? data.apiLink : t("client:noLink")}
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
          <Space
            direction="vertical"
            size="middle"
            className={styles.infoStores__buttons}
          >
            <Row align="middle" justify="start">
              <Popconfirm
                cancelText={t("cancel")}
                disabled={remainingBuilds <= 0}
                okText={
                  app?.builds.edges.length === 0 ? t("publish") : t("update")
                }
                title={
                  <Trans
                    i18nKey={
                      app?.builds.edges.length === 0
                        ? "warnings.publish"
                        : "warnings.update"
                    }
                    ns="client"
                  >
                    <strong></strong>
                    <p></p>
                    <p></p>
                    <p>{{ num: remainingBuilds }}</p>
                  </Trans>
                }
                onConfirm={() => {
                  console.log("PUBLISH APP");
                }}
              >
                <Tooltip
                  title={"Límite de actualizaciones alcanzado"}
                  visible={limitExceded && remainingBuilds <= 0}
                >
                  <Button
                    className={styles.info__button}
                    danger={remainingBuilds <= 0}
                    onMouseEnter={() => setLimitExceded(true)}
                    onMouseLeave={() => setLimitExceded(false)}
                    type={remainingBuilds <= 0 ? "default" : "primary"}
                  >
                    {app?.builds.edges.length === 0
                      ? t("client:publishApp")
                      : t("client:updateApp")}
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Row>
            <Row>
              <Popconfirm
                cancelText={t("cancel")}
                disabled={!hasChanged || loadingUpdate}
                okText={t("save")}
                title={
                  <Trans
                    i18nKey={
                      app?.builds.edges.length === 0
                        ? "warnings.publish"
                        : "warnings.update"
                    }
                    ns="client"
                  >
                    <strong></strong>
                    <p></p>
                    <p></p>
                    <p>{{ num: remainingBuilds }}</p>
                  </Trans>
                }
                onConfirm={() => {
                  console.log("SAVE CHANGES APP");
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
                <Button
                  className={styles.info__button}
                  disabled={!hasChanged || loadingUpdate}
                  loading={loadingUpdate}
                  type="ghost"
                >
                  {t("client:saveChanges")}
                </Button>
              </Popconfirm>
            </Row>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default AppInfo;
