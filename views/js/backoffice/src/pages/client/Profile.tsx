import { Card, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import { useQuery } from "@apollo/client";
import { Payment } from "../../models/App";
import { Link, useHistory } from "react-router-dom";
import { getAppBuildState } from "../../lib/appBuildState";
import {
  Placeholder,
  BuildState as BuildStateVisualizer,
  TitleWithAction,
  ProfileInfo,
} from "../../components/molecules";
import { MY_ACCOUNT } from "../../api/queries";
import {
  MyAccount,
  MyAccount_me_apps_edges_node,
} from "../../api/types/MyAccount";
import Loading from "../../components/atoms/Loading";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import ProfileDangerZone from "../../components/organisms/ProfileDangerZone";

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

const appsColumns: ColumnsType<MyAccount_me_apps_edges_node> = [
  {
    title: "Icono",
    dataIndex: "logo",
    key: "icon",
    render: (logo) => (
      <img
        src={logo}
        alt=""
        width={40}
        height={40}
        style={{ objectFit: "contain" }}
      />
    ),
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
    dataIndex: "storeLinks",
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
        <BuildStateVisualizer
          state={getAppBuildState(record)}
        ></BuildStateVisualizer>
      );
    },
  },
];

const Profile = () => {
  const history = useHistory();
  const { loading, data } = useQuery<MyAccount>(MY_ACCOUNT);
  if (loading) return <Loading />;
  return (
    <>
      <Row gutter={20}>
        <Col span={12}>
          <Row style={{ marginBottom: 20 }}>
            <Col span="24">
              <Card>
                <ProfileInfo
                  reverse
                  editable
                  name={data?.me?.username ?? ""}
                  email={data?.me?.email ?? ""}
                />
                <ProfileDangerZone id={data?.me?.id ?? ""} />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Card>
                {(data?.me?.apps?.edges.length ?? 0) > 0 ? (
                  <>
                    <TitleWithAction
                      title="Apps"
                      action={{
                        action: () => history.push("/app/new"),
                        label: "Añadir nueva",
                      }}
                    />
                    <Table
                      columns={appsColumns}
                      dataSource={data?.me?.apps.edges.map(
                        (edge) => edge!!.node!!
                      )}
                    />
                  </>
                ) : (
                  <Placeholder
                    claim="Crea tu primera App y empieza a vender"
                    cta={{ title: "Añadir nueva app", link: "/app/new" }}
                  ></Placeholder>
                )}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card>
            {data?.me?.accountStatus === AccountAccountStatus.REGISTERED ? (
              <Placeholder
                claim="Suscríbete para poder tener tu propia App"
                cta={{ title: "Suscribirse", link: "/pay" }}
              ></Placeholder>
            ) : (
              <>
                <TitleWithAction
                  title="Pagos"
                  action={{
                    action: () => console.log("cancelar suscripción"), //TODO: Cancel suscription
                    label: "Cancelar suscripción",
                  }}
                />
                <Table
                  columns={paymentsColumns}
                  dataSource={[]} // TODO: Payments
                />
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Profile;
