import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Payment } from "../../models/App";
import { Link, useHistory } from "react-router-dom";
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
import { UNSUBSCRIBE } from "../../api/mutations";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";
import { EllipsisOutlined } from "@ant-design/icons";

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
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { loading, data } = useQuery<MyAccount>(MY_ACCOUNT);
  const [unsubscribe] = useMutation<Unsubscribe, UnsubscribeVariables>(
    UNSUBSCRIBE
  );
  if (loading) return <Loading />;

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile/edit">Editar</Link>
      </Menu.Item>
      <Menu.Divider></Menu.Divider>
      <Menu.Item>
        <Popconfirm
          title="¿Realmente deseas eliminar la cuenta?"
          placement="left"
          onConfirm={() => {
            setConfirmPassword(true);
            setIsOverlayVisible(false);
          }}
        >
          <Typography.Text type="danger">Eliminar cuenta</Typography.Text>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  const profieActions = (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      visible={isOverlayVisible}
      onVisibleChange={setIsOverlayVisible}
    >
      <Button shape="circle" icon={<EllipsisOutlined></EllipsisOutlined>} />
    </Dropdown>
  );
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
                <ProfileInfo profile={data?.me} action={profieActions} />
                <ProfileDangerZone
                  id={data?.me?.id ?? ""}
                  confirmPassword={confirmPassword}
                />
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
                    action: () => {
                      if (data?.me?.id) {
                        unsubscribe({
                          variables: {
                            userId: data?.me?.id,
                          },
                        });
                      }
                    },
                    label: "Cancelar suscripción",
                    needsConfirmation: true,
                    confirmationTitle: (
                      <>
                        <h4>
                          ¿Realmente deseas cancelar la suscripción al servicio?
                        </h4>
                        <p>
                          Todas las apps que tengas serán eliminadas de las
                          tiendas de aplicaciones
                        </p>
                      </>
                    ),
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
