import { Card, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import {
  AccountState,
  App,
  BuildState,
  Client,
  Payment,
} from "../../models/App";
import BuildStateVisualizer from "../../components/molecules/BuildState";
import TitleWithAction from "../../components/molecules/TitleWithAction";
import SubscribePlaceholder from "../../components/organisms/SubscribePlaceholder";
import { Link } from "react-router-dom";
import { getAppBuildState } from "../../lib/appBuildState";

const paymentsColumns: ColumnsType<Payment> = [
  {
    title: "Fecha",
    dataIndex: "initial",
    key: "date",
    render: (date: Date) => date.toLocaleDateString(),
  },
  {
    title: "Concepto",
    dataIndex: "concept",
    key: "concept",
  },
  {
    title: "Total",
    dataIndex: "quantity",
    key: "total",
    render: (total: number) =>
      new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(total),
  },
];

const appsColumns: ColumnsType<App> = [
  {
    title: "Icono",
    dataIndex: "logo",
    key: "icon",
    render: (logo) => <img src={logo} alt="" width={40} height={40} />,
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    render: (name, record) => <Link to={`/app/${record.id}`}>{name}</Link>,
  },
  { title: "ID", dataIndex: "id", key: "id" },
  {
    title: "URLs",
    dataIndex: "urls",
    key: "urls",
    render: (urls) => (
      <>
        <a href={urls.ios}>iOS</a>
        <a href={urls.android}>Android</a>
      </>
    ),
  },
  {
    title: "Estado",
    dataIndex: "builds",
    key: "state",
    render: (_, record) => {
      return (
        (
        <BuildStateVisualizer
        
           state={getAppBuildState(record)}
        
        ></BuildStateVisualizer>
      )
      );
    },
  },
];

const Profile = () => {
  const profile: Client = {
    id: "1",
    name: "Jesus",
    state: AccountState.STALLED,
    payments: [
      {
        id: "1",
        confirmed: true,
        until: new Date(),
        initial: new Date(),
        quantity: 60,
        concept: "Simply App",
      },
      {
        id: "2",
        confirmed: true,
        until: new Date(),
        initial: new Date(),
        quantity: 60,
        concept: "Simply App",
      },
      {
        id: "3",
        confirmed: true,
        until: new Date(),
        initial: new Date(),
        quantity: 60,
        concept: "Simply App",
      },
      {
        id: "4",
        confirmed: true,
        until: new Date(),
        initial: new Date(),
        quantity: 60,
        concept: "Simply App",
      },
    ],
    apps: [
      {
        name: "PacoPinta",
        id: "212edf23fc4g",
        logo:
          "https://playbaikoh.com/wp-content/uploads/2015/05/Game_icon_skull_BAIKOH_perfil.png",
        urls: { ios: "", android: "" },
        builds: [{ id: "123", state: BuildState.PUBLISHED }],
      },
      {
        name: "Testing",
        id: "wedfghjui7654",
        logo: "https://appiconmaker.co/home/appicon/testid?size=1024",
        urls: { ios: "", android: "" },
        builds: [{ id: "123", state: BuildState.WAITING }],
      },
    ],
  };
  return (
    <>
      <Row gutter={20}>
        <Col span={12}>
          <Card>
            {
              profile.state === AccountState.STALLED ?
                <SubscribePlaceholder></SubscribePlaceholder>
              :
              <>
              <TitleWithAction 
              title="Pagos" 
              action={{
                action: () => console.log('cancelar suscripción'), 
                label: "Cancelar suscripción"
              }}
            />
            <Table columns={paymentsColumns} dataSource={profile.payments} />
              </>
            }
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <TitleWithAction 
              title="Apps" 
              action={{
                action: () => console.log('Añadir nueva'),
                label: "Añadir nueva"
              }} 
            />
            <Table columns={appsColumns} dataSource={profile.apps} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Profile;
