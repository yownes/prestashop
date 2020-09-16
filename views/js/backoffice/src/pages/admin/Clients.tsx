import { Tag } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import React from "react";
import { AccountState, App, Client } from "../../models/App";

const COLORS = {
  STALLED: "default",
  CONFIRMING: "orange",
  PAID: "green",
  BANNED: "red",
};

const columns: ColumnsType<Client> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  { title: "ID Cliente", dataIndex: "id", key: "id" },
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
  const data: Client[] = [
    {
      id: "bvxdtyq56w7w89",
      name: "Jesús",
      apps: [{ id: "1" }],
      state: AccountState.STALLED,
    },
    {
      id: "bvxdtyq56w7w89",
      name: "Alejandro",
      apps: [{ id: "1" }, { id: "2" }, { id: "3" }],
      state: AccountState.CONFIRMING,
    },
    {
      id: "bvxdtyq56w7w89",
      name: "Antoni",
      apps: [{ id: "1" }, { id: "1" }],
      state: AccountState.PAID,
    },
    {
      id: "bvxdtyq56w7w89",
      name: "Jorge",
      apps: [{ id: "1" }],
      state: AccountState.BANNED,
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Clients;
