import Table, { ColumnsType } from "antd/lib/table";
import React from "react";
import { Link } from "react-router-dom";
import {
  MyAccount_me_apps,
  MyAccount_me_apps_edges_node,
} from "../../api/types/MyAccount";
import { getAppBuildState } from "../../lib/appBuildState";
import connectionToNodes from "../../lib/connectionToNodes";
import BuildState from "./BuildState";

interface AppsTableProps {
  dataSource?: MyAccount_me_apps;
  columns?: ColumnsType<MyAccount_me_apps_edges_node>;
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
  {
    title: "URLs",
    dataIndex: "storeLinks",
    key: "urls",
    // responsive: ["md"],
    render: (urls) => {
      if (!urls.ios && !urls.android) return <span>-</span>;
      return (
        <>
          <a href={urls.ios} style={{ padding: 5 }}>
            iOS
          </a>
          <a href={urls.android} style={{ padding: 5 }}>
            Android
          </a>
        </>
      );
    },
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

const AppsTable = ({ dataSource, columns }: AppsTableProps) => {
  const allCols = columns ? [...appsColumns, ...columns] : appsColumns;
  return (
    <Table
      columns={allCols}
      dataSource={connectionToNodes(dataSource)}
      pagination={false}
    />
  );
};

export default AppsTable;
