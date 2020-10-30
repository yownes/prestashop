import React from "react";
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
import { Button, Card, Col, message, Popconfirm, Row, Typography } from "antd";
import UserState from "../../components/molecules/UserState";
import AppsTable from "../../components/molecules/AppsTable";
import BuildsTable from "../../components/molecules/BuildsTable";
import { DeleteOutlined } from "@ant-design/icons";
import { BAN_USER, DELETE_APP } from "../../api/mutations";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { BanUser, BanUserVariables } from "../../api/types/BanUser";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import connectionToNodes from "../../lib/connectionToNodes";

const { Text } = Typography;

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
  const { id } = useParams<ClientProps>();
  const { loading, data } = useQuery<IClient, ClientVariables>(CLIENT, {
    variables: { id },
  });
  const [deleteApp] = useMutation<DeleteApp, DeleteAppVariables>(DELETE_APP);
  const [banUser] = useMutation<BanUser, BanUserVariables>(BAN_USER);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row style={{ marginBottom: 20 }}>
        <Col sm={12} xs={24}>
          <Card>
            <Row gutter={10}>
              <Col xl={12} md={24}>
                <div>
                  <Text>ID: </Text>
                  <Text strong>{data?.user?.id}</Text>
                </div>
                <div>
                  <Text>Username: </Text>
                  <Text strong>{data?.user?.username}</Text>
                </div>
                <div>
                  <Text>Activo: </Text>
                  <Text strong>{data?.user?.isActive ? "Si" : "No"}</Text>
                </div>
                <div>
                  <Text>Estado: </Text>
                  <UserState state={data?.user?.accountStatus} />
                </div>
              </Col>
              <Col sm={12} xs={24}>
                <Button danger>Dar de baja la suscripción</Button>
                <Popconfirm title={data?.user?.accountStatus === AccountAccountStatus.BANNED ? "¿Desbanear?": "¿Banear?"} onConfirm={() => {
                  if (data?.user?.id) {
                    banUser({
                      variables: {
                        userId: data.user.id,
                        ban:
                          data?.user?.accountStatus !==
                          AccountAccountStatus.BANNED,
                      },
                      update(cache, {data: banData}) {
                        if (banData?.banUser?.ok) {
                          cache.modify({
                            id: cache.identify({...data.user}),
                            fields: {
                              accountStatus(prev: AccountAccountStatus) {
                                return (
                                  prev ===
                                  AccountAccountStatus.BANNED ? AccountAccountStatus.REGISTERED : AccountAccountStatus.BANNED
                                );
                              }
                            }
                          })
                        }
                      }
                    });
                  }
                }}>
                  <Button danger>Banear Cuenta</Button>
                </Popconfirm>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col md={12} sm={24}>
          <Card>
            <AppsTable
              dataSource={data?.user?.apps}
              columns={[
                {
                  title: "Acciones",
                  key: "actions",
                  render: (_, record) => {
                    return (
                      <Popconfirm
                        title="¿Quieres eliminar esta app?"
                        onConfirm={() => {
                          console.log("eliminar", record);
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
            <BuildsTable dataSource={getBuilds(data?.user?.apps)} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Client;
