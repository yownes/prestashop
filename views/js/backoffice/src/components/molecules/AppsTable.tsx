import React, { useMemo } from "react";
import { Space, Table, Typography } from "antd";
import { forIn } from "lodash";
import { ColumnsType } from "antd/lib/table";
import BuildStateVisualizer from "../../components/molecules/BuildState";
import { FileImageOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  Client_user_apps,
  Client_user_apps_edges_node,
} from "../../api/types/Client";
import { getAppBuildState } from "../../lib/appBuildState";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Filter,
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";
import BuildState from "./BuildState";
import { AppBasicData } from "../../api/types/AppBasicData";
import styles from "./AppsTable.module.css";

interface AppsTableProps {
  dataSource?: Client_user_apps;
  columns?: ColumnsType<AppBasicData>;
}

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

const AppsTable = ({ dataSource, columns }: AppsTableProps) => {
  const { t } = useTranslation("translation");
  const allCols = useMemo(() => {
    const cols: ColumnsType<AppBasicData> = [
      {
        title: t("icon"),
        dataIndex: "logo",
        key: "icon",
        render: (logo) =>
          logo ? (
            <img
              src={logo}
              alt={t("logo")}
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <FileImageOutlined className={styles.icon} />
          ),
      },
      {
        title: t("name"),
        dataIndex: "name",
        key: "name",
        render: (name) => <Typography.Text strong>{name}</Typography.Text>,
        ...getColumnSearchProps<Client_user_apps_edges_node>(
          ["name"],
          t("admin:search", { data: t("app") }),
          t("search"),
          t("reset")
        ),
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: t("urls"),
        dataIndex: "storeLinks",
        key: "urls",
        // responsive: ["md"],
        render: (urls) => {
          return (
            <Space size="middle">
              {urls.ios ? (
                <a href={urls.ios} rel="noopener noreferrer" target="_blank">
                  iOS
                </a>
              ) : (
                <Typography.Text disabled>iOS</Typography.Text>
              )}
              <Typography.Text>-</Typography.Text>
              {urls.android ? (
                <a
                  href={urls.android}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Android
                </a>
              ) : (
                <Typography.Text disabled>Android</Typography.Text>
              )}
            </Space>
          );
        },
      },
      {
        title: t("state"),
        dataIndex: "builds",
        key: "state",
        render: (_, record) => {
          return <BuildState state={getAppBuildState(record)}></BuildState>;
        },
        ...getColumnFilterProps<Client_user_apps_edges_node>(
          ["builds", "edges", "_", "node", "buildStatus"],
          getBuildStatusFilters(),
          "last"
        ),
        sorter: (a, b) =>
          getAppBuildState(a).localeCompare(getAppBuildState(b)),
      },
    ];
    return columns ? [...cols, ...columns] : cols;
  }, [columns, t]);
  const data = connectionToNodes(dataSource);
  return (
    <Table
      columns={allCols}
      dataSource={data}
      locale={{ emptyText: t("noApps") }}
      pagination={data.length > 5 ? { pageSize: 5 } : false}
      rowClassName={(row) => (!row.isActive ? styles.app_deleted : "")}
      rowKey={(row) => row.id}
    />
  );
};

export default AppsTable;
