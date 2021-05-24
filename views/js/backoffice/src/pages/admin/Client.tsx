import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client";
import { CLIENT } from "../../api/queries";
import { Client as IClient, ClientVariables } from "../../api/types/Client";
import Loading from "../../components/atoms/Loading";
import LoadingFullScreen from "../../components/atoms/LoadingFullScreen";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  message,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import AppsTable from "../../components/molecules/AppsTable";
import BuildsTable, {
  getBuildsForCustomer,
} from "../../components/molecules/BuildsTable";
import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { BAN_USER, DELETE_APP, UNSUBSCRIBE } from "../../api/mutations";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { BanUser, BanUserVariables } from "../../api/types/BanUser";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import { ProfileInfo } from "../../components/molecules";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";

const { Text, Title } = Typography;

interface ClientProps {
  id: string;
}

const Client = () => {
  const { t } = useTranslation(["translation", "admin"]);
  const { id } = useParams<ClientProps>();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { loading, data } = useQuery<IClient, ClientVariables>(CLIENT, {
    variables: { id },
  });
  const [deleteApp, { loading: deleting }] = useMutation<
    DeleteApp,
    DeleteAppVariables
  >(DELETE_APP);
  const [banUser, { loading: banning }] = useMutation<
    BanUser,
    BanUserVariables
  >(BAN_USER);
  const [unsubscribe, { loading: unsubscribing }] = useMutation<
    Unsubscribe,
    UnsubscribeVariables
  >(UNSUBSCRIBE);
  if (loading) {
    return <Loading />;
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <Popconfirm
          cancelText={t("cancel")}
          okText={
            data?.user?.accountStatus === AccountAccountStatus.BANNED
              ? t("admin:unban")
              : t("admin:ban")
          }
          title={
            data?.user?.accountStatus === AccountAccountStatus.BANNED
              ? t("admin:warnings.unban")
              : t("admin:warnings.ban")
          }
          onConfirm={() => {
            setIsOverlayVisible(false);
            if (data?.user?.id) {
              banUser({
                variables: {
                  userId: data.user.id,
                  ban:
                    data?.user?.accountStatus !== AccountAccountStatus.BANNED,
                },
                update(cache, { data: banData }) {
                  if (banData?.banUser?.ok) {
                    cache.modify({
                      id: cache.identify({ ...data.user }),
                      fields: {
                        accountStatus(prev: AccountAccountStatus) {
                          return prev === AccountAccountStatus.BANNED
                            ? AccountAccountStatus.REGISTERED
                            : AccountAccountStatus.BANNED;
                        },
                      },
                    });
                    data?.user?.accountStatus === AccountAccountStatus.BANNED
                      ? message.success(t("admin:unbanAccountSuccessful"), 4)
                      : message.success(t("admin:banAccountSuccessful"), 4);
                  } else {
                    message.error(banData?.banUser?.error, 4);
                  }
                },
              });
            }
          }}
        >
          <Text type="danger" style={{ display: "flex", flex: 1 }}>
            {data?.user?.accountStatus === AccountAccountStatus.BANNED
              ? t("admin:unbanAccount")
              : t("admin:banAccount")}
          </Text>
        </Popconfirm>
      </Menu.Item>
      {data?.user?.subscription && (
        <Menu.Item>
          <Popconfirm
            cancelText={t("cancel")}
            okText={t("admin:unsubscribe")}
            title={t("admin:warnings.unsubscribe")}
            placement="left"
            onConfirm={() => {
              setIsOverlayVisible(false);
              unsubscribe({
                variables: { userId: id },
                update(cache, { data: unsubscribeData }) {
                  if (unsubscribeData?.dropOut?.ok) {
                    console.log("drop out OK", data.user?.subscription);
                    cache.modify({
                      id: cache.identify({ ...data.user }),
                      fields: {
                        subscription: () => undefined,
                      },
                    });
                  } else {
                    console.log("drop out ERR");
                  }
                },
              })
                .then((data) => {
                  if (data.data?.dropOut?.ok) {
                    message.success(t("admin:unsubscribeAccountSuccessful"));
                  } else {
                    message.error(data.data?.dropOut?.error, 4);
                  }
                })
                .catch((err) => message.error(err, 4));
            }}
          >
            <Text type="danger" style={{ display: "flex", flex: 1 }}>
              {t("admin:unsubscribeAccount")}
            </Text>
          </Popconfirm>
        </Menu.Item>
      )}
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
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card>
            <Row gutter={10}>
              <Col span={24}>
                <ProfileInfo
                  profile={data?.user}
                  action={profieActions}
                  verified
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col></Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col md={12} sm={24}>
          <Card>
            <Title>{t("admin:apps")}</Title>
            <AppsTable
              dataSource={data?.user?.apps}
              columns={[
                {
                  title: t("admin:actions"),
                  key: "actions",
                  render: (_, record) => {
                    if (!record.isActive) {
                      return <Typography>{t("admin:deletedApp")}</Typography>;
                    }
                    return (
                      <Popconfirm
                        title={t("admin:warnings.app")}
                        onConfirm={() => {
                          deleteApp({
                            variables: {
                              id: record.id,
                            },
                            update(cache, { data }) {
                              if (data?.deleteApp?.ok) {
                                const id = cache.identify({ ...record });
                                cache.evict({
                                  id,
                                });
                                cache.gc();
                                message.success(
                                  t("admin:deleteAppSuccessful"),
                                  4
                                );
                              } else {
                                message.error(data?.deleteApp?.error, 4);
                              }
                            },
                          });
                        }}
                      >
                        <Button danger>
                          <DeleteOutlined />
                        </Button>
                      </Popconfirm>
                    );
                  },
                },
              ]}
            />
          </Card>
        </Col>
        <Col md={12} sm={24}>
          <Card>
            <Title>{t("admin:builds")}</Title>
            <BuildsTable dataSource={getBuildsForCustomer(data?.user)} />
          </Card>
        </Col>
      </Row>
      {banning &&
        (data?.user?.accountStatus === AccountAccountStatus.BANNED ? (
          <LoadingFullScreen tip={t("admin:unbanning")} />
        ) : (
          <LoadingFullScreen tip={t("admin:banning")} />
        ))}
      {deleting && <LoadingFullScreen tip={t("admin:deleting")} />}
      {unsubscribing && <LoadingFullScreen tip={t("admin:unsubscribing")} />}
    </>
  );
};

export default Client;
