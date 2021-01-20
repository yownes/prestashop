import Table, { ColumnsType } from "antd/lib/table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
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

const AppsTable = ({ dataSource, columns }: AppsTableProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const allCols = useMemo(() => {
    const cols: ColumnsType<MyAccount_me_apps_edges_node> = [
      {
        title: t("icon"),
        dataIndex: "logo",
        key: "icon",
        render: (logo) => (
          <img
            src={logo}
            alt={t("logo")}
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
          />
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
      locale={{ emptyText: t("admin:noApps") }}
      pagination={data.length < 5 ? false : { pageSize: 5 }}
    />
  );
};

export default AppsTable;
