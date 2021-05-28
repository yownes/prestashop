import React, { useMemo } from "react";
import { Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FileImageOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Client_user_apps } from "../../api/types/Client";
import { getAppBuildState } from "../../lib/appBuildState";
import connectionToNodes from "../../lib/connectionToNodes";
import BuildState from "./BuildState";
import { AppBasicData } from "../../api/types/AppBasicData";
import styles from "./AppsTable.module.css";

interface AppsTableProps {
  dataSource?: Client_user_apps;
  columns?: ColumnsType<AppBasicData>;
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
      rowClassName={(row) => (!row.isActive ? styles.app_deleted : "")}
      rowKey={(row) => row.id}
    />
  );
};

export default AppsTable;
