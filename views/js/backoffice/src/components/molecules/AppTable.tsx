import React, { useMemo } from "react";
import { Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FileImageOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { Apps_apps, Apps_apps_edges_node } from "../../api/types/Apps";
import { getAppBuildState } from "../../lib/appBuildState";
import connectionToNodes from "../../lib/connectionToNodes";
import BuildState from "./BuildState";
import styles from "./AppTable.module.css";

interface AppsTableProps {
  dataSource?: Apps_apps | null;
  columns?: ColumnsType<Apps_apps_edges_node>;
}

const AppsTable = ({ dataSource, columns }: AppsTableProps) => {
  const { t } = useTranslation("translation");
  const history = useHistory();
  const allCols = useMemo(() => {
    const cols: ColumnsType<Apps_apps_edges_node> = [
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
        render: (name, record) => <Link to={`/app/${record.id}`}>{name}</Link>,
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
      onRow={(record) => {
        if (record.storeLinks?.android && record.storeLinks?.ios) {
          return {};
        }
        return {
          onClick: () => history.push(`/app/${record.id}`),
        };
      }}
      rowClassName={styles.row}
      rowKey={(row) => row.id}
    />
  );
};

export default AppsTable;
