import { Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TitleWithAction, AppInfo } from "../../components/molecules";
import { TemplateSelector, ColorPicker } from "../../components/organisms";
import { AppGen, BuildState } from "../../models/App";

interface AppParamTypes {
  appId?: string;
}

async function getAppById(id: string): Promise<AppGen> {
  const app = {
    name: "PacoPinta",
    id,
    template: { id: "2" },
    logo:
      "https://playbaikoh.com/wp-content/uploads/2015/05/Game_icon_skull_BAIKOH_perfil.png",
    urls: { ios: "", android: "" },
    builds: [{ id: "123", state: BuildState.PUBLISHED }],
  }  
  return app;
}

const baseApp: AppGen = {
  template: {
    id: "1",
  },
  color: { color: "#0099cc", text: "white" },
};

const App = () => {
  const { appId } = useParams<AppParamTypes>();
  const [app, setApp] = useState<AppGen>();

  useEffect(() => {
    if (appId) {
      getAppById(appId).then(app => {
        setApp(app)
      });
    } else {
      setApp(baseApp)
    }
  }, [appId])
  if (!app) return <div>Loading...</div>
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
                <TemplateSelector value={app.template?.id} onChange={(selected) => {
                  setApp(val => ({
                    ...val,
                    template: {
                      id: selected
                    }
                  }))
                }} />
                <ColorPicker value={app.color} onChange={(selected) => {
                  setApp(val => ({
                    ...val,
                    color: selected
                  }))
                }} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card>Aqui la preview</Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;
