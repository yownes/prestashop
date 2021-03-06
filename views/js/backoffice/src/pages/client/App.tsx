import { Button, Card, Col, message, Popconfirm, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { DELETE_APP } from "../../api/mutations";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { APP, APP_OWNER_ACTIVE, ME } from "../../api/queries";
import { App as IApp, AppVariables, App_app } from "../../api/types/App";
import { AppOwnerActive } from "../../api/types/AppOwnerActive";
import { Me } from "../../api/types/Me";
import Loading from "../../components/atoms/Loading";
import { AppInfo } from "../../components/molecules";
import { TemplateSelector, ColorPicker } from "../../components/organisms";
import AppPreview from "../../components/organisms/AppPreview";
import { StoreAppInput } from "../../api/types/globalTypes";
import AppPayment from "../../components/organisms/AppPayment";
import { Trans, useTranslation } from "react-i18next";
import styles from "./App.module.css";
import LoadingFullScreen from "../../components/atoms/LoadingFullScreen";

interface AppParamTypes {
  appId?: string;
}

function appsAreEqual(state: StoreAppInput, app?: App_app | null): boolean {
  if (!app) {
    return false;
  }
  return (
    app.apiLink === state.apiLink &&
    app.color?.color === state.color?.color &&
    app.color?.text === state.color?.text &&
    app.name === state.name &&
    app.template?.id === state.template &&
    app.logo === state.logo
  );
}

export const baseApp: StoreAppInput = {
  apiLink: "(no link)",
  template: "VGVtcGxhdGVUeXBlOjE=",
  name: "(no name)",
  color: { color: "#0099cc", text: "white" },
  logo: null,
};

const { Title } = Typography;

const App = () => {
  const [state, setState] = useState<StoreAppInput>(baseApp);
  const [notYourRecurse, setNotYourRecurse] = useState(false);
  const { appId } = useParams<AppParamTypes>();
  const { t } = useTranslation(["translation", "client"]);
  const history = useHistory();
  const { data: me } = useQuery<Me>(ME);
  const {
    loading: loadingOwnerActive,
    data: dataOwnerActive,
  } = useQuery<AppOwnerActive>(APP_OWNER_ACTIVE, { variables: { id: appId } });
  const [getAppById, { loading, data }] = useLazyQuery<IApp, AppVariables>(APP);
  const [deleteApp, { loading: deleting }] = useMutation<
    DeleteApp,
    DeleteAppVariables
  >(DELETE_APP);
  useEffect(() => {
    if (data?.app) {
      setState({
        apiLink: data.app.apiLink,
        template: data.app.template?.id,
        name: data.app.name,
        color: {
          color: data.app.color?.color ?? baseApp.color?.color,
          text: data.app.color?.text ?? baseApp.color?.text,
        },
        logo: data.app.logo,
      });
    }
  }, [data, me]);
  useEffect(() => {
    if (appId) {
      if (dataOwnerActive?.appcustomer?.isOwnerAndActive) {
        getAppById({ variables: { id: appId } });
      }
      if (dataOwnerActive?.appcustomer?.isOwnerAndActive === false) {
        setNotYourRecurse(true);
      }
    } else {
      setNotYourRecurse(true);
    }
  }, [appId, dataOwnerActive, getAppById]);
  if (loadingOwnerActive || !state || loading) return <Loading />;
  if (notYourRecurse) return <Redirect to="/profile" />;
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card>
            <AppInfo
              data={state}
              id={data?.app?.id}
              onChange={(app) => setState(app)}
              app={data?.app ?? undefined}
              hasChanged={!appsAreEqual(state, data?.app)}
            />
          </Card>
        </Col>
        <Col></Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col lg={14} xs={24}>
          <Card className={styles.card}>
            <Title level={2}>{t("client:style")}</Title>
            <TemplateSelector
              value={state.template!!}
              onChange={(selected) => {
                setState((val) => ({
                  ...val,
                  template: selected,
                }));
              }}
            />
            <ColorPicker
              value={state.color!!}
              onChange={(selected) => {
                setState((val) => ({
                  ...val,
                  color: selected,
                }));
              }}
            />
          </Card>
        </Col>
        <Col lg={10} xs={24}>
          <Card className={styles.card}>
            {data?.app?.id ? (
              <AppPreview id={data?.app?.id} app={state} />
            ) : null}
          </Card>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col></Col>
        <Col span={24}>
          <Card>{appId ? <AppPayment appId={appId} /> : null}</Card>
        </Col>
        <Col></Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Popconfirm
            cancelText={t("cancel")}
            okText={t("delete")}
            title={
              <Trans i18nKey="warnings.app" ns="client">
                <strong></strong>
                <p></p>
              </Trans>
            }
            onConfirm={() => {
              deleteApp({
                variables: { id: appId!! },
                update(cache, { data }) {
                  if (data?.deleteApp?.ok) {
                    cache.evict({
                      id: cache.identify({
                        __typename: "StoreAppType",
                        id: appId,
                      }),
                    });
                    cache.gc();
                    message.success(t("client:appDeleted"), 4);
                    history.replace("/profile");
                  } else {
                    message.error(
                      t(`client:appErrors.${data?.deleteApp?.error}`) ||
                        "Error",
                      4
                    );
                  }
                },
              });
            }}
          >
            <Button
              disabled={deleting}
              loading={deleting}
              type="primary"
              danger
            >
              {t("client:deleteApp")}
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      {deleting && <LoadingFullScreen tip={t("client:deletingApp")} />}
    </>
  );
};

export default App;
