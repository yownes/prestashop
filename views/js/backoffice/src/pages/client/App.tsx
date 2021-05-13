import { Button, Card, Col, message, Popconfirm, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { DELETE_APP } from "../../api/mutations";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { Me } from "../../api/types/Me";
import { APP, ME } from "../../api/queries";
import { App as IApp, AppVariables, App_app } from "../../api/types/App";
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
  const { appId } = useParams<AppParamTypes>();
  const [notYourRecurse, setNotYourRecurse] = useState(false);
  const [state, setState] = useState<StoreAppInput>(baseApp);
  const { t } = useTranslation(["translation", "client"]);
  const history = useHistory();
  const { data: me } = useQuery<Me>(ME);
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
      if (data.app.customer?.id !== me?.me?.id) {
        setNotYourRecurse(true);
      }
    }
  }, [data, me]);
  useEffect(() => {
    if (appId) {
      getAppById({ variables: { id: appId } });
    }
  }, [appId, getAppById]);
  if (!state || loading) return <Loading />;
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
        <Col span={14}>
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
        <Col span={10}>
          <Card className={styles.card}>
            <AppPreview id={data?.app?.id!!} app={state} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col></Col>
        <Col span={24}>
          <Card>
            <AppPayment appId={appId!!} />
          </Card>
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
                <div>¿Realmente deseas eliminar la App?</div>
                <div>Será retirada de la AppStore y PlayStore</div>
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
      {deleting && <LoadingFullScreen tip={t("deleting")} />}
    </>
  );
};

export default App;
