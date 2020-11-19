import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
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
import { Trans, useTranslation } from "react-i18next";

const Profile = () => {
  const history = useHistory();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { t } = useTranslation(["client", "translation"]);
  const { loading, data } = useQuery<MyAccount>(MY_ACCOUNT);
  const [unsubscribe] = useMutation<Unsubscribe, UnsubscribeVariables>(
    UNSUBSCRIBE
  );
  if (loading) return <Loading />;

  const profileMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile/edit">{t("edit")}</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/profile/paymentMethods">{t("changePaymentMethod")}</Link>
      </Menu.Item>
      <Menu.Divider></Menu.Divider>
      {data?.me?.accountStatus === AccountAccountStatus.PAID_ACCOUNT && (
        <Menu.Item>
          <Popconfirm
            title={
              <Trans i18nKey="warnings.subscription" ns="client">
                <h4>¿Realmente deseas cancelar la suscripción al servicio?</h4>
                <p>
                  Todas las apps que tengas serán eliminadas de las tiendas de
                  aplicaciones
                </p>
              </Trans>
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
              {t("cancelSubscription")}
            </Typography.Text>
          </Popconfirm>
        </Menu.Item>
      )}
      <Menu.Item>
        <Popconfirm
          title={t("warnings.account")}
          placement="left"
          onConfirm={() => {
            setConfirmPassword(true);
            setIsOverlayVisible(false);
          }}
        >
          <Typography.Text type="danger">{t("deleteAccount")}</Typography.Text>
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
              message={t("validate.message")}
              description={t("validate.description")}
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
                claim={t("subscribeNow")}
                cta={{ title: t("subscribe"), link: "/pay" }}
              ></Placeholder>
            )}
          </Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card>
            {(data?.me?.apps?.edges.length ?? 0) > 0 ? (
              <>
                <TitleWithAction
                  title={t("translation:apps")}
                  action={{
                    action: () => history.push("/app/new"),
                    label: t("addNew"),
                  }}
                />
                <AppsTable dataSource={data?.me?.apps} />
              </>
            ) : (
              <Placeholder
                claim={t("addAppClaim")}
                cta={{ title: t("addNewApp"), link: "/app/new" }}
              ></Placeholder>
            )}
          </Card>
        </Col>
      </Row>
      <Modal
        visible={confirmPassword}
        title={t("deleteAccount")}
        onCancel={() => {
          setConfirmPassword(false);
        }}
        okButtonProps={{ style: { display: "none" } }}
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
