import React from "react";
import { Tag } from "antd";
import { useQuery } from "@apollo/client";
import Table, { ColumnsType } from "antd/lib/table";
import { Link } from "react-router-dom";
import { CLIENTS } from "../../api/queries";
import { AccountState, App } from "../../models/App";
import {
  Clients as IClients,
  ClientsVariables,
  Clients_users_edges_node,
} from "../../api/types/Clients";
import Loading from "../../components/atoms/Loading";

// TODO: state -> COLORS
const COLORS = {
  STALLED: "default",
  CONFIRMING: "orange",
  PAID: "green",
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
    dataIndex: "apps",
    key: "apps",
    render: (apps: App[]) => apps.length,
  },
  {
    title: "Estado",
    dataIndex: "state",
    key: "state",
    render: (state: AccountState) => {
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
