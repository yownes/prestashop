import React from "react";
import { Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useTranslation } from "react-i18next";
import { Builds_builds_edges_node } from "../../api/types/Builds";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import BuildState from "./BuildState";
import styles from "./BuildsTable.module.css";
import { Client_user } from "../../api/types/Client";
import connectionToNodes from "../../lib/connectionToNodes";

interface BuildsTableProps {
  dataSource: Builds_builds_edges_node[];
}

export function getBuildsForCustomer(
  user?: Client_user | null
): Builds_builds_edges_node[] {
  if (!user) {
    return [];
  }
  const nodes = connectionToNodes(user.apps);
  let all: Builds_builds_edges_node[] = [];
  nodes.forEach((app) => {
    const buildNodes =
      connectionToNodes(app.builds).map((build) => ({
        ...build,
        app: {
          ...app,
          customer: user ?? null,
        },
      })) ?? [];
    all.push(...buildNodes);
  });
  return all;
}

const BuildsTable = ({ dataSource }: BuildsTableProps) => {
  const { t } = useTranslation("translation");
  const columns: ColumnsType<Builds_builds_edges_node> = [
    {
      title: t("date"),
      dataIndex: "date",
      key: "data",
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: t("buildId"),
      dataIndex: "buildId",
      key: "buildId",
      render: (buildId) => <Typography.Text strong>{buildId}</Typography.Text>,
    },
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
      locale={{ emptyText: t("noBuilds") }}
      pagination={dataSource.length > 5 ? { pageSize: 5 } : false}
      rowClassName={(row) => (!row.app?.isActive ? styles.app_deleted : "")}
      rowKey={(row) => row.buildId}
    />
  );
};

export default BuildsTable;
