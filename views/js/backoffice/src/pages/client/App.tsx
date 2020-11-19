import { Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { APP } from "../../api/queries";
import { App as IApp, AppVariables, App_app } from "../../api/types/App";
import Loading from "../../components/atoms/Loading";
import { TitleWithAction, AppInfo } from "../../components/molecules";
import { TemplateSelector, ColorPicker } from "../../components/organisms";
import AppPreview from "../../components/organisms/AppPreview";
import { StoreAppInput } from "../../api/types/globalTypes";
import AppPayment from "../../components/organisms/AppPayment";
import { useTranslation } from "react-i18next";

interface AppParamTypes {
  appId?: string;
}

function appsAreEqual(state: StoreAppInput, app?: App_app | null): boolean {
  if (!app) {
    return false;
  }
  return (
    app.color?.color === state.color?.color &&
    app.color?.text === state.color?.text &&
    app.name === state.name &&
    app.template?.id === state.template &&
    app.logo === state.logo
  );
}

const baseApp: StoreAppInput = {
  template: "VGVtcGxhdGVUeXBlOjE=",
  name: "(no name)",
  color: { color: "#0099cc", text: "white" },
  logo: null,
};

const App = () => {
  const { appId } = useParams<AppParamTypes>();
  const [state, setState] = useState<StoreAppInput>(baseApp);
  const { t } = useTranslation("client");
  const [getAppById, { loading, data }] = useLazyQuery<IApp, AppVariables>(APP);
  useEffect(() => {
    if (data?.app) {
      setState({
        template: data.app.template?.id,
        name: data.app.name,
        color: {
          color: data.app.color?.color ?? baseApp.color?.color,
          text: data.app.color?.text ?? baseApp.color?.text,
        },
        logo: data.app.logo,
      });
    }
  }, [data]);
  useEffect(() => {
    if (appId) {
      getAppById({ variables: { id: appId } });
    }
  }, [appId, getAppById]);
  if (!state || loading) return <Loading />;
  return (
    <div>
      <Row gutter={20}>
        <Col span={12}>
          <Row>
            <AppInfo
              data={state}
              id={data?.app?.id}
              onChange={(app) => setState(app)}
              app={data?.app ?? undefined}
            />
          </Row>
          <Row>
            <Col span={24}>
              <Card>
                <TitleWithAction title={t("style")} />
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
                <AppPayment appId={appId!!} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card>
            <AppPreview
              id={data?.app?.id!!}
              app={state}
              hasChanged={!appsAreEqual(state, data?.app)}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;
