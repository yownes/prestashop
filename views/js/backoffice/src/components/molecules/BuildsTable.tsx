import Table, { ColumnsType } from "antd/lib/table";
import React from "react";
import { Client_user_apps_edges_node_builds_edges_node } from "../../api/types/Client";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import BuildState from "./BuildState";

const columns: ColumnsType<Client_user_apps_edges_node_builds_edges_node> = [
  {
    title: "Fecha",
    dataIndex: "date",
    key: "data",
    render: (date: Date) => date.toLocaleDateString(),
  },
  { title: "ID build", dataIndex: "id", key: "buildId" },
  {
    title: "Estado",
    dataIndex: "buildStatus",
    key: "state",
    render: (state: BuildBuildStatus) => {
      return <BuildState state={state}></BuildState>;
    },
  },
];

interface BuildsTableProps {
  dataSource: Client_user_apps_edges_node_builds_edges_node[];
}

const BuildsTable = ({ dataSource }: BuildsTableProps) => {
  return <Table columns={columns} dataSource={dataSource} />;
};

export default BuildsTable;
