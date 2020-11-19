import React from "react";
import { Table } from "antd";
import { useQuery } from "@apollo/client";
import { ColumnsType } from "antd/lib/table";
import BuildStateVisualizer from "../../components/molecules/BuildState";
import { Builds as IBuilds, BuildsVariables, Builds_builds_edges_node } from "../../api/types/Builds";
import { BUILDS } from "../../api/queries";
import Loading from "../../components/atoms/Loading";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import connectionToNodes from "../../lib/connectionToNodes";
import { useTranslation } from "react-i18next";

const Builds = () => {
  const { loading, data } = useQuery<IBuilds, BuildsVariables>(BUILDS);
  const { t } = useTranslation(["translation", "admin"]);
  if (loading) {
    return <Loading />;
  }
  const columns: ColumnsType<Builds_builds_edges_node> = [
    {
      title: t("admin:date"),
      dataIndex: "date",
      key: "data",
      render: (date: Date) => date.toLocaleDateString(),
    },
    { title: t("buildId"), dataIndex: "id", key: "buildId" },
    {
      title: t("admin:client"),
      dataIndex: ["app", "client", "name"],
      key: "client",
    },
    {
      title: t("admin:clientID"),
      dataIndex: ["app", "customer", "id"],
      key: "clientId",
    },
    { title: t("app"), dataIndex: ["app", "name"], key: "app" },
    {
      title: t("state"),
      dataIndex: "buildStatus",
      key: "state",
      render: (state: BuildBuildStatus) => {
        return <BuildStateVisualizer state={state}></BuildStateVisualizer>;
      },
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={connectionToNodes(data?.builds)} />
    </div>
  );
};

export default Builds;
