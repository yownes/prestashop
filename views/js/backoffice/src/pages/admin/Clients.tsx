import React from "react";
import { useQuery } from "@apollo/client";
import Table, { ColumnsType } from "antd/lib/table";
import { Link } from "react-router-dom";
import { CLIENTS } from "../../api/queries";
import {
  Clients as IClients,
  ClientsVariables,
  Clients_users_edges_node,
  Clients_users_edges_node_apps_edges,
} from "../../api/types/Clients";
import Loading from "../../components/atoms/Loading";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import UserState from "../../components/molecules/UserState";
import connectionToNodes from "../../lib/connectionToNodes";
import { useTranslation } from "react-i18next";

const Clients = () => {
  const { t } = useTranslation(["translation", "admin"]);
  const { loading, data } = useQuery<IClients, ClientsVariables>(CLIENTS);
  if (loading) {
    return <Loading />;
  }

  const columns: ColumnsType<Clients_users_edges_node> = [
    {
      title: t("name"),
      dataIndex: "username",
      key: "name",
      render: (name, record) => (
        <Link to={`/clients/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: t("admin:clientID"),
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/clients/${id}`}>{id}</Link>,
    },
    {
      title: t("apps"),
      dataIndex: ["apps", "edges"],
      key: "apps",
      render: (apps: Clients_users_edges_node_apps_edges[]) => apps.length,
    },
    {
      title: t("state"),
      dataIndex: "accountStatus",
      key: "state",
      render: (state: AccountAccountStatus) => <UserState state={state} />,
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={connectionToNodes(data?.users)} />
    </div>
  );
};

export default Clients;
