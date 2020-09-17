import { Card, Col, Row, Space } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { TitleWithAction, AppInfo } from "../../components/molecules";
import { TemplateSelector, ColorPicker } from "../../components/organisms";
import { App as IApp, BuildState } from "../../models/App";

interface AppParamTypes {
  appId: string;
}

const App = () => {
  const { appId } = useParams<AppParamTypes>();
  const app: IApp = {
    name: "PacoPinta",
    id: appId,
    logo:
      "https://playbaikoh.com/wp-content/uploads/2015/05/Game_icon_skull_BAIKOH_perfil.png",
    urls: { ios: "", android: "" },
    builds: [{ id: "123", state: BuildState.PUBLISHED }],
  };
  return (
    <div>
      <Row gutter={20}>
        <Col span={12}>
          <Row>
            <AppInfo app={app} />
          </Row>
          <Row>
            <Col span={24}>
              <Card>
                <TitleWithAction title="Estilo" />
                <TemplateSelector />
                <ColorPicker />
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
