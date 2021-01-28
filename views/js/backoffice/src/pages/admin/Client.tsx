import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { CLIENT } from "../../api/queries";
import {
  Client as IClient,
  ClientVariables,
  Client_user_apps,
  Client_user_apps_edges_node_builds_edges_node,
} from "../../api/types/Client";
import Loading from "../../components/atoms/Loading";
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
import BuildsTable from "../../components/molecules/BuildsTable";
import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { BAN_USER, DELETE_APP, UNSUBSCRIBE } from "../../api/mutations";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { BanUser, BanUserVariables } from "../../api/types/BanUser";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import connectionToNodes from "../../lib/connectionToNodes";
import { ProfileInfo } from "../../components/molecules";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

interface ClientProps {
  id: string;
}

function getBuilds(apps?: Client_user_apps) {
  const nodes = connectionToNodes(apps);
  let all: Client_user_apps_edges_node_builds_edges_node[] = [];
  nodes.forEach(({ builds, name, id }) => {
    const buildNodes =
      connectionToNodes(builds).map((build) => ({
        ...build,
        app: { id, name },
      })) ?? [];
    all.push(...buildNodes);
  });
  return all;
}

const Client = () => {
  const { t } = useTranslation(["translation", "admin"]);
  const { id } = useParams<ClientProps>();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { loading, data } = useQuery<IClient, ClientVariables>(CLIENT, {
    variables: { id },
  });
  const [deleteApp] = useMutation<DeleteApp, DeleteAppVariables>(DELETE_APP);
  const [banUser] = useMutation<BanUser, BanUserVariables>(BAN_USER);
  const [unsubscribe] = useMutation<Unsubscribe, UnsubscribeVariables>(
    UNSUBSCRIBE
  );
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
                  }
                },
              });
            }
          }}
        >
          <Text type="danger">
            {data?.user?.accountStatus === AccountAccountStatus.BANNED
              ? t("admin:unbanAccount")
              : t("admin:banAccount")}
          </Text>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          cancelText={t("cancel")}
          okText={t("admin:unsubscribe")}
          title={t("admin:warnings.unsubscribe")}
          placement="left"
          onConfirm={() => {
            setIsOverlayVisible(false);
            unsubscribe({ variables: { userId: id } });
          }}
        >
          <Text type="danger">{t("admin:unsubscribeAccount")}</Text>
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
                                console.log({ id });

                                cache.evict({
                                  id,
                                });
                                cache.gc();
                              } else {
                                message.error(data?.deleteApp?.error);
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
            <BuildsTable dataSource={getBuilds(data?.user?.apps)} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Client;
