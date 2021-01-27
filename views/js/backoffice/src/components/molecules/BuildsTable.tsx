import Table, { ColumnsType } from "antd/lib/table";
import React from "react";
import { useTranslation } from "react-i18next";
import { Client_user_apps_edges_node_builds_edges_node } from "../../api/types/Client";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import BuildState from "./BuildState";

interface BuildsTableProps {
  dataSource: Client_user_apps_edges_node_builds_edges_node[];
}

const BuildsTable = ({ dataSource }: BuildsTableProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const columns: ColumnsType<Client_user_apps_edges_node_builds_edges_node> = [
    {
      title: t("date"),
      dataIndex: "date",
      key: "data",
      render: (date: Date) => date.toLocaleDateString(),
    },
    { title: t("buildId"), dataIndex: "id", key: "buildId" },
    { title: "App", dataIndex: ["app", "name"], key: "app.name" },
    {
      title: t("state"),
      dataIndex: "buildStatus",
      key: "state",
      render: (state: BuildBuildStatus) => {
        return <BuildState state={state}></BuildState>;
      },
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      locale={{ emptyText: t("admin:noBuilds") }}
      pagination={dataSource.length > 5 ? { pageSize: 5 } : false}
      rowKey={(row) => row.id}
    />
  );
};

export default BuildsTable;
