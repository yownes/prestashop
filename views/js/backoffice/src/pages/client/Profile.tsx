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
import { APPS, MY_ACCOUNT } from "../../api/queries";
import { MyAccount } from "../../api/types/MyAccount";
import {
  AccountAccountStatus,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import ProfileDangerZone from "../../components/organisms/ProfileDangerZone";
import AppTable from "../../components/molecules/AppTable";
import { RESUBSCRIBE, UNSUBSCRIBE } from "../../api/mutations";
import { Apps, AppsVariables } from "../../api/types/Apps";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";
import { Resubscribe, ResubscribeVariables } from "../../api/types/Resubscribe";
import { EllipsisOutlined } from "@ant-design/icons";
import { Trans, useTranslation } from "react-i18next";

const Profile = () => {
  const history = useHistory();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isResubscribed, setIsResubscribed] = useState(false);
  const { t } = useTranslation(["translation", "client"]);
  const { loading, data } = useQuery<MyAccount>(MY_ACCOUNT);
  const { loading: loadingData, data: appsData } = useQuery<
    Apps,
    AppsVariables
  >(APPS, {
    variables: { is_active: true },
  });
  const [
    unsubscribe,
    { loading: unsubscribing, data: unsubscribeData },
  ] = useMutation<Unsubscribe, UnsubscribeVariables>(UNSUBSCRIBE);
  const [
    resubscribe,
    { loading: resubscribing, data: resubscribeData },
  ] = useMutation<Resubscribe, ResubscribeVariables>(RESUBSCRIBE);
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
  useEffect(() => {
    if (resubscribeData?.takeUp?.ok) {
      if (isResubscribed) {
        message.success(t("client:resubscribeSuccessful"), 4);
        setIsResubscribed(false);
      }
    }
  }, [isResubscribed, t, resubscribeData]);

  if (loading || loadingData) return <Loading />;

  const profileMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile/edit">{t("edit")}</Link>
      </Menu.Item>
      <Menu.Divider></Menu.Divider>
      {data?.me?.subscription && !data.me.subscription.cancelAtPeriodEnd && (
        <Menu.Item>
          <Popconfirm
            cancelText={t("cancel")}
            okText={t("confirm")}
            title={
              <Trans
                i18nKey={
                  appsData?.apps && appsData?.apps?.edges.length > 0
                    ? "warnings.cancelSubscription"
                    : "warnings.cancelSubscriptionNoApps"
                }
                ns="client"
              >
                <strong></strong>
                <p></p>
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
                          subscription: () => undefined,
                        },
                      });
                    }
                  },
                });
                setIsUnsubscribed(true);
              }
            }}
          >
            <Typography.Text type="danger" style={{ display: "flex", flex: 1 }}>
              {t("client:cancelSubscription")}
            </Typography.Text>
          </Popconfirm>
        </Menu.Item>
      )}
      <Menu.Item>
        <Popconfirm
          cancelText={t("cancel")}
          okText={t("delete")}
          title={
            <Trans
              i18nKey={
                data?.me?.subscription
                  ? appsData?.apps && appsData?.apps?.edges.length > 0
                    ? "warnings.accountSubsApps"
                    : "warnings.accountSubsNoApps"
                  : appsData?.apps && appsData?.apps?.edges.length > 0
                  ? "warnings.accountNoSubsApps"
                  : "warnings.accountNoSubsNoApps"
              }
              ns="client"
            >
              <strong></strong>
              <p></p>
            </Trans>
          }
          placement="left"
          onConfirm={() => {
            setConfirmPassword(true);
            setIsOverlayVisible(false);
          }}
        >
          <Typography.Text type="danger" style={{ display: "flex", flex: 1 }}>
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
            {data?.me?.subscription?.status === SubscriptionStatus.ACTIVE &&
              data.me.subscription.cancelAtPeriodEnd && (
                <Placeholder claim={t("client:reSubscribeNow")}>
                  {
                    <Popconfirm
                      cancelText={t("cancel")}
                      okText={t("confirm")}
                      title={
                        <Trans
                          i18nKey={"warnings.unCancelSubscription"}
                          ns="client"
                        >
                          <strong></strong>
                          <p></p>
                        </Trans>
                      }
                      placement="left"
                      onConfirm={() => {
                        if (data?.me?.id) {
                          resubscribe({
                            variables: { userId: data.me.id },
                            update(cache, { data: resubs }) {
                              if (resubs?.takeUp?.ok) {
                                cache.modify({
                                  id: cache.identify({
                                    ...data.me?.subscription,
                                  }),
                                  fields: {
                                    cancelAtPeriodEnd: () => false,
                                  },
                                });
                              }
                            },
                          });
                          setIsResubscribed(true);
                        }
                      }}
                    >
                      <Button type="primary">{t("client:reSubscribe")}</Button>
                    </Popconfirm>
                  }
                </Placeholder>
              )}
          </Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card>
            {(appsData?.apps?.edges.length ?? 0) > 0 ? (
              <>
                <TitleWithAction
                  title={t("apps")}
                  action={{
                    action: () => history.push("/app/new"),
                    label: t("client:addNewApp"),
                  }}
                />
                <AppTable dataSource={appsData?.apps} />
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
        <ProfileDangerZone confirmPassword={confirmPassword} />
      </Modal>
      {unsubscribing && <LoadingFullScreen tip={t("client:unsubscribing")} />}
      {resubscribing && <LoadingFullScreen tip={t("client:resubscribing")} />}
    </>
  );
};

export default Profile;
