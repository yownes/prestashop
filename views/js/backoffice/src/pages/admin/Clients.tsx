import React from "react";
import { Tag } from "antd";
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

// TODO: state -> COLORS
const COLORS = {
  REGISTERED: "default",
  WAITING_PAYMENT: "orange",
  PAID_ACCOUNT: "green",
  BANNED: "red",
};

const columns: ColumnsType<Clients_users_edges_node> = [
  {
    title: "Name",
    dataIndex: "username",
    key: "name",
    render: (name, record) => <Link to={`/clients/${record.id}`}>{name}</Link>,
  },
  {
    title: "ID Cliente",
    dataIndex: "id",
    key: "id",
    render: (id) => <Link to={`/clients/${id}`}>{id}</Link>,
  },
  {
    title: "Apps",
    dataIndex: ["apps", "edges"],
    key: "apps",
    render: (apps: Clients_users_edges_node_apps_edges[]) => apps.length,
  },
  {
    title: "Estado",
    dataIndex: "accountStatus",
    key: "state",
    render: (state: AccountAccountStatus) => {
      const color = COLORS[state];
      return <Tag color={color}>{state}</Tag>;
    },
  },
];

const Clients = () => {
  const { loading, data } = useQuery<IClients, ClientsVariables>(CLIENTS);
  if (loading) {
    return <Loading />;
  }
  const dataSource = data?.users?.edges.map((edge) => edge!!.node!!) ?? [];
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default Clients;
