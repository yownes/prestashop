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

const columns: ColumnsType<Builds_builds_edges_node> = [
  {
    title: "Fecha",
    dataIndex: "date",
    key: "data",
    render: (date: Date) => date.toLocaleDateString(),
  },
  { title: "ID build", dataIndex: "id", key: "buildId" },
  { title: "Cliente", dataIndex: ["app", "client", "name"], key: "client" },
  {
    title: "ID Cliente",
    dataIndex: ["app", "customer", "id"],
    key: "clientId",
  },
  { title: "App", dataIndex: ["app", "name"], key: "app" },
  {
    title: "Estado",
    dataIndex: "buildStatus",
    key: "state",
    render: (state: BuildBuildStatus) => {
      return <BuildStateVisualizer state={state}></BuildStateVisualizer>;
    },
  },
];

const Builds = () => {
  const {loading, data} = useQuery<IBuilds, BuildsVariables>(BUILDS)
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <Table columns={columns} dataSource={connectionToNodes(data?.builds)} />
    </div>
  );
};

export default Builds;
