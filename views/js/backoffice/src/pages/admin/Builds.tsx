import React from "react";
import { Table } from "antd";
import forIn from "lodash/forIn";
import { useQuery } from "@apollo/client";
import { ColumnsType } from "antd/lib/table";
import BuildStateVisualizer from "../../components/molecules/BuildState";
import {
  Builds as IBuilds,
  BuildsVariables,
  Builds_builds_edges_node,
} from "../../api/types/Builds";
import { BUILDS } from "../../api/queries";
import Loading from "../../components/atoms/Loading";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Filter,
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";
import { useTranslation } from "react-i18next";

function getBuildStatusFilters() {
  let filters: Filter[] = [];
  forIn(BuildBuildStatus, (value) => {
    filters.push({
      text: <BuildStateVisualizer state={value}></BuildStateVisualizer>,
      value: value,
    });
  });
  return filters;
}

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
      sorter: (a, b) => a.date - b.date,
    },
    {
      title: t("buildId"),
      dataIndex: "id",
      key: "buildId",
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["id"],
        t("admin:search", { data: t("buildId") }),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: t("admin:client"),
      dataIndex: ["app", "customer", "username"],
      key: "client",
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["app", "customer", "username"],
        t("admin:search", { data: t("admin:client") }),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) =>
        a.app!.customer!.username.localeCompare(b.app!.customer!.username),
    },
    {
      title: t("admin:clientID"),
      dataIndex: ["app", "customer", "id"],
      key: "clientId",
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["app", "customer", "id"],
        t("admin:search", { data: t("admin:clientID") }),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.app!.customer!.id.localeCompare(b.app!.customer!.id),
    },
    {
      title: t("app"),
      dataIndex: ["app", "name"],
      key: "app",
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["app", "name"],
        t("admin:app"),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.app!.name.localeCompare(b.app!.name),
    },
    {
      title: t("state"),
      dataIndex: "buildStatus",
      key: "state",
      render: (state: BuildBuildStatus) => {
        return <BuildStateVisualizer state={state}></BuildStateVisualizer>;
      },
      ...getColumnFilterProps<Builds_builds_edges_node>(
        ["buildStatus"],
        getBuildStatusFilters()
      ),
      sorter: (a, b) => a.buildStatus.localeCompare(b.buildStatus),
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={connectionToNodes(data?.builds)}
        rowKey={(row) => row.id}
      />
    </div>
  );
};

export default Builds;
