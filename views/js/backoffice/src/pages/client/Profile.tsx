import { Alert, Card, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import { useQuery } from "@apollo/client";
import { Payment } from "../../models/App";
import { useHistory } from "react-router-dom";
import {
  Placeholder,
  TitleWithAction,
  ProfileInfo,
} from "../../components/molecules";
import { MY_ACCOUNT } from "../../api/queries";
import { MyAccount } from "../../api/types/MyAccount";
import Loading from "../../components/atoms/Loading";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import ProfileDangerZone from "../../components/organisms/ProfileDangerZone";
import AppsTable from "../../components/molecules/AppsTable";

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

const Profile = () => {
  const history = useHistory();
  const { loading, data } = useQuery<MyAccount>(MY_ACCOUNT);
  if (loading) return <Loading />;
  return (
    <>
      {!data?.me?.verified && (
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Alert
              showIcon
              message="Tu cuenta no está validada todavía"
              description="Comprueba tu correo electrónico en busca del link de validación"
              type="warning"
            />
          </Col>
        </Row>
      )}
      <Row gutter={20}>
        <Col span={12}>
          <Row style={{ marginBottom: 20 }}>
            <Col span="24">
              <Card>
                <ProfileInfo profile={data?.me} />
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
                    <AppsTable dataSource={data?.me?.apps} />
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
