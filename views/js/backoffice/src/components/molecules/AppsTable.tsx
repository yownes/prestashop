import Table, { ColumnsType } from "antd/lib/table";
import React from "react";
import { Link } from "react-router-dom";
import {
  MyAccount_me_apps,
  MyAccount_me_apps_edges_node,
} from "../../api/types/MyAccount";
import { getAppBuildState } from "../../lib/appBuildState";
import BuildState from "./BuildState";

interface AppsTableProps {
  dataSource?: MyAccount_me_apps;
}

const appsColumns: ColumnsType<MyAccount_me_apps_edges_node> = [
  {
    title: "Icono",
    dataIndex: "logo",
    key: "icon",
    render: (logo) => (
      <img
        src={logo}
        alt=""
        width={40}
        height={40}
        style={{ objectFit: "contain" }}
      />
    ),
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    render: (name, record) => <Link to={`/app/${record.id}`}>{name}</Link>,
  },
  { title: "ID", dataIndex: "id", key: "id" },
  {
    title: "URLs",
    dataIndex: "storeLinks",
    key: "urls",
    render: (urls) => (
      <>
        <a href={urls.ios}>iOS</a>
        <a href={urls.android}>Android</a>
      </>
    ),
  },
  {
    title: "Estado",
    dataIndex: "builds",
    key: "state",
    render: (_, record) => {
      return <BuildState state={getAppBuildState(record)}></BuildState>;
    },
  },
];

const AppsTable = ({ dataSource }: AppsTableProps) => {
  return (
    <Table
      columns={appsColumns}
      dataSource={dataSource?.edges.map((edge) => edge!!.node!!)}
    />
  );
};

export default AppsTable;
