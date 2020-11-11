import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
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
import connectionToNodes from "../../lib/connectionToNodes";
import CreditCard from "../../components/molecules/CreditCard";

const Profile = () => {
  const history = useHistory();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [changePaymentMethod, setChangePaymentMethod] = useState(false);
  const { loading, data } = useQuery<MyAccount>(MY_ACCOUNT);
  const [unsubscribe] = useMutation<Unsubscribe, UnsubscribeVariables>(
    UNSUBSCRIBE
  );
  if (loading) return <Loading />;

  const profileMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile/edit">Editar</Link>
      </Menu.Item>
      <Menu.Item onClick={() => setChangePaymentMethod(true)}>
        Cambiar método de pago
      </Menu.Item>
      <Menu.Divider></Menu.Divider>
      {data?.me?.accountStatus === AccountAccountStatus.PAID_ACCOUNT && (
        <Menu.Item>
          <Popconfirm
            title={
              <>
                <h4>¿Realmente deseas cancelar la suscripción al servicio?</h4>
                <p>
                  Todas las apps que tengas serán eliminadas de las tiendas de
                  aplicaciones
                </p>
              </>
            }
            placement="left"
            onConfirm={() => {
              setIsOverlayVisible(false);
              if (data?.me?.id) {
                unsubscribe({ variables: { userId: data?.me?.id } });
              }
            }}
          >
            <Typography.Text type="danger">
              Cancelar suscripción
            </Typography.Text>
          </Popconfirm>
        </Menu.Item>
      )}
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
      overlay={profileMenu}
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
      <Row gutter={[20, 20]}>
        <Col lg={12} xs={24}>
          <Card>
            <ProfileInfo profile={data?.me} action={profieActions} />
            {data?.me?.accountStatus === AccountAccountStatus.REGISTERED && (
              <Placeholder
                claim="Suscríbete para poder tener tu propia App"
                cta={{ title: "Suscribirse", link: "/pay" }}
              ></Placeholder>
            )}
          </Card>
        </Col>
        <Col lg={12} xs={24}>
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
      <Modal
        visible={changePaymentMethod}
        onOk={() => {
          setChangePaymentMethod(false);
        }}
        onCancel={() => {
          setChangePaymentMethod(false);
        }}
      >
        <Radio.Group
          value={data?.me?.customer?.defaultPaymentMethod?.id}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        >
          {connectionToNodes(data?.me?.customer?.paymentMethods).map((node) => (
            <Radio key={node.id} value={node.id}>
              <CreditCard data={node.card} />
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
      <Modal
        visible={confirmPassword}
        title="Eliminación de cuenta"
        onCancel={() => {
          setConfirmPassword(false);
        }}
        okButtonProps={{style:{display: 'none'}}}
      >
        <ProfileDangerZone
          id={data?.me?.id ?? ""}
          confirmPassword={confirmPassword}
        />
      </Modal>
    </>
  );
};

export default Profile;
