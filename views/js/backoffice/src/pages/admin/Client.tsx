import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CLIENT } from "../../api/queries";
import {
  Client as IClient,
  ClientVariables,
  Client_user_apps,
  Client_user_apps_edges_node_builds_edges_node,
} from "../../api/types/Client";
import Loading from "../../components/atoms/Loading";
import { Card, Col, Row } from "antd";
import UserState from "../../components/molecules/UserState";
import AppsTable from "../../components/molecules/AppsTable";
import BuildsTable from "../../components/molecules/BuildsTable";

interface ClientProps {
  id: string;
}

function getBuilds(apps?: Client_user_apps) {
  const nodes = apps?.edges.map((edge) => edge!!.node!!) ?? [];
  let all: Client_user_apps_edges_node_builds_edges_node[] = [];
  nodes.forEach(({ builds, name, id }) => {
    const buildNodes =
      builds.edges
        .map((edge) => edge!!.node!!)
        .map((build) => ({ ...build, app: { id, name } })) ?? [];
    all.push(...buildNodes);
  });
  return all;
}

const Client = () => {
  const { id } = useParams<ClientProps>();
  const { loading, data } = useQuery<IClient, ClientVariables>(CLIENT, {
    variables: { id },
  });
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row style={{ marginBottom: 20 }}>
        <Col md={6} sm={12} xs={24}>
          <Card>
            <div>
              <span>ID: </span>
              <span>{data?.user?.id}</span>
            </div>
            <div>
              <span>Username: </span>
              <span>{data?.user?.username}</span>
            </div>
            <div>
              <span>Activo: </span>
              <span>{data?.user?.isActive ? "Si" : "No"}</span>
            </div>
            <div>
              <span>Estado: </span>
              <span>
                <UserState state={data?.user?.accountStatus} />
              </span>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col md={12} sm={24}>
          <Card>
            <AppsTable dataSource={data?.user?.apps} />
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
