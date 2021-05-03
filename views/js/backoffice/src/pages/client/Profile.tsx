import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../components/atoms/Loading";
import LoadingFullScreen from "../../components/atoms/LoadingFullScreen";
import {
  Placeholder,
  TitleWithAction,
  ProfileInfo,
} from "../../components/molecules";
import { MY_ACCOUNT } from "../../api/queries";
import { MyAccount } from "../../api/types/MyAccount";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import ProfileDangerZone from "../../components/organisms/ProfileDangerZone";
import AppTable from "../../components/molecules/AppTable";
import { UNSUBSCRIBE } from "../../api/mutations";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";
import { EllipsisOutlined } from "@ant-design/icons";
import { Trans, useTranslation } from "react-i18next";

const Profile = () => {
  const history = useHistory();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const { t } = useTranslation(["translation", "client"]);
  const { loading, data } = useQuery<MyAccount>(MY_ACCOUNT);
  console.log("MY ACCOUNT", data);
  const [
    unsubscribe,
    { loading: unsubscribing, data: unsubscribeData },
  ] = useMutation<Unsubscribe, UnsubscribeVariables>(UNSUBSCRIBE);
  message.config({
    maxCount: 1,
  });
  useEffect(() => {
    if (unsubscribeData?.dropOut?.ok) {
      if (isUnsubscribed) {
        message.success(t("client:unsubscribeSuccessful"), 4);
        setIsUnsubscribed(false);
      }
    }
  }, [isUnsubscribed, t, unsubscribeData]);

  if (loading) return <Loading />;

  const profileMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile/edit">{t("update")}</Link>
      </Menu.Item>
      <Menu.Divider></Menu.Divider>
      {data?.me?.accountStatus === AccountAccountStatus.PAID_ACCOUNT && (
        <Menu.Item>
          <Popconfirm
            cancelText={t("cancel")}
            okText={t("confirm")}
            title={
              <Trans i18nKey="warnings.cancelSubscription" ns="client">
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
                unsubscribe({
                  variables: { userId: data?.me?.id },
                  update(cache, { data: result }) {
                    if (result?.dropOut?.ok && data.me) {
                      cache.modify({
                        id: cache.identify({
                          ...data?.me,
                        }),
                        fields: {
                          accountStatus: () => AccountAccountStatus.REGISTERED,
                        },
                      });
                    }
                  },
                });
                setIsUnsubscribed(true);
              }
            }}
          >
            <Typography.Text type="danger">
              {t("client:cancelSubscription")}
            </Typography.Text>
          </Popconfirm>
        </Menu.Item>
      )}
      <Menu.Item>
        <Popconfirm
          cancelText={t("cancel")}
          okText={t("delete")}
          title={t("client:warnings.account")}
          placement="left"
          onConfirm={() => {
            setConfirmPassword(true);
            setIsOverlayVisible(false);
          }}
        >
          <Typography.Text type="danger">
            {t("client:deleteAccount")}
          </Typography.Text>
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
              message={t("client:validate.message")}
              description={t("client:validate.description")}
              type="warning"
            />
          </Col>
          <Col></Col>
        </Row>
      )}
      <Row gutter={[20, 20]}>
        <Col lg={12} xs={24}>
          <Card>
            <ProfileInfo profile={data?.me} action={profieActions} />
            {data?.me?.accountStatus === AccountAccountStatus.REGISTERED && (
              <Placeholder
                claim={t("client:subscribeNow")}
                cta={{ title: t("client:subscribe"), link: "/checkout" }}
              ></Placeholder>
            )}
          </Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card>
            {(data?.me?.apps?.edges.length ?? 0) > 0 ? (
              <>
                <TitleWithAction
                  title={t("apps")}
                  action={{
                    action: () => history.push("/app/new"),
                    label: t("client:addNewApp"),
                  }}
                />
                <AppTable dataSource={data?.me?.apps} />
              </>
            ) : (
              <Placeholder
                claim={t("client:addAppClaim")}
                cta={{ title: t("client:addNewApp"), link: "/app/new" }}
              ></Placeholder>
            )}
          </Card>
        </Col>
      </Row>
      <Modal
        visible={confirmPassword}
        title={t("client:deleteAccount")}
        onCancel={() => {
          setConfirmPassword(false);
        }}
        footer={null}
      >
        <ProfileDangerZone
          id={data?.me?.id ?? ""}
          confirmPassword={confirmPassword}
        />
      </Modal>
      {unsubscribing && <LoadingFullScreen tip={t("client:unsubscribing")} />}
    </>
  );
};

export default Profile;
