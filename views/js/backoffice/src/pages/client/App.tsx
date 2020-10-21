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
import { BuildBuildStatus } from "../../api/types/globalTypes";

interface AppParamTypes {
  appId?: string;
}

const baseApp: App_app = {
  __typename: "StoreAppType",
  template: {
    __typename: "TemplateType",
    id: "VGVtcGxhdGVUeXBlOjE=",
  },
  id: "",
  name: "",
  builds: { __typename: "BuildTypeConnection", edges: [] },
  color: { __typename: "StoreColors", color: "#0099cc", text: "white" },
  storeLinks: null,
  logo: null,
  apiLink: null,
};

const App = () => {
  const { appId } = useParams<AppParamTypes>();
  const [app, setApp] = useState<App_app>(baseApp);
  const [getAppById, { loading, data }] = useLazyQuery<IApp, AppVariables>(APP);
  useEffect(() => {
    if (data?.app) {
      setApp(data?.app);
    }
  }, [data]);
  useEffect(() => {
    if (appId) {
      getAppById({ variables: { id: appId } });
    }
  }, [appId]);
  if (!app || loading) return <Loading />;
  return (
    <div>
      <Row gutter={20}>
        <Col span={12}>
          <Row>
            <AppInfo app={app} onChange={(app) => setApp(app)} />
          </Row>
          <Row>
            <Col span={24}>
              <Card>
                <TitleWithAction title="Estilo" />
                <TemplateSelector
                  value={app.template?.id}
                  onChange={(selected) => {
                    setApp((val) => ({
                      ...val,
                      template: {
                        __typename: "TemplateType",
                        id: selected,
                      },
                    }));
                  }}
                />
                <ColorPicker
                  value={app.color!!}
                  onChange={(selected) => {
                    setApp((val) => ({
                      ...val,
                      color: { __typename: "StoreColors", ...selected },
                    }));
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card>
            <AppPreview app={app} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;
