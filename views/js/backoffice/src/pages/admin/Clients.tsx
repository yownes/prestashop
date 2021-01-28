import React from "react";
import { useQuery } from "@apollo/client";
import Table, { ColumnsType } from "antd/lib/table";
import forIn from "lodash/forIn";
import { Link, useHistory } from "react-router-dom";
import { CLIENTS } from "../../api/queries";
import {
  Clients as IClients,
  ClientsVariables,
  Clients_users_edges_node,
  Clients_users_edges_node_apps_edges,
} from "../../api/types/Clients";
import Loading from "../../components/atoms/Loading";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import UserState from "../../components/molecules/UserState";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Filter,
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";
import { useTranslation } from "react-i18next";
import VerifiedState from "../../components/molecules/VerifiedState";

function getAccountStatusFilters() {
  let filters: Filter[] = [];
  forIn(AccountAccountStatus, (value) => {
    filters.push({ text: <UserState state={value}></UserState>, value: value });
  });
  return filters;
}

function getVerifiedStatusFilters() {
  let filters: Filter[] = [];
  filters.push({
    text: <VerifiedState verified={true} />,
    value: true,
  });
  filters.push({
    text: <VerifiedState verified={false} />,
    value: false,
  });
  return filters;
}

const Clients = () => {
  const history = useHistory();
  const { t } = useTranslation(["translation", "admin"]);
  const { loading, data } = useQuery<IClients, ClientsVariables>(CLIENTS);
  if (loading) {
    return <Loading />;
  }

  const columns: ColumnsType<Clients_users_edges_node> = [
    {
      title: t("name"),
      dataIndex: "username",
      key: "name",
      render: (name, record) => (
        <Link to={`/clients/${record.id}`}>{name}</Link>
      ),
      ...getColumnSearchProps<Clients_users_edges_node>(
        ["username"],
        t("admin:search", { data: t("name") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: t("admin:clientID"),
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/clients/${id}`}>{id}</Link>,
      ...getColumnSearchProps<Clients_users_edges_node>(
        ["id"],
        t("admin:search", { data: t("admin:clientID") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: t("apps"),
      dataIndex: ["apps", "edges"],
      key: "apps",
      render: (apps: Clients_users_edges_node_apps_edges[]) => apps.length,
      sorter: (a, b) => a.apps.edges.length - b.apps.edges.length,
    },
    {
      title: t("state"),
      dataIndex: "accountStatus",
      key: "state",
      render: (state: AccountAccountStatus) => <UserState state={state} />,
      ...getColumnFilterProps<Clients_users_edges_node>(
        ["accountStatus"],
        getAccountStatusFilters()
      ),
      sorter: (a, b) => a.accountStatus.localeCompare(b.accountStatus),
    },
    {
      title: t("verifiedStatus"),
      dataIndex: "verified",
      key: "verified",
      render: (verified: boolean) => <VerifiedState verified={verified} />,
      ...getColumnFilterProps<Clients_users_edges_node>(
        ["verified"],
        getVerifiedStatusFilters()
      ),
      sorter: (a, b) => Number(a.verified) - Number(b.verified),
    },
  ];
  const dataSource = connectionToNodes(data?.users);
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        onRow={(record) => {
          return { onClick: () => history.push(`/clients/${record.id}`) };
        }}
        pagination={dataSource.length > 5 ? { pageSize: 5 } : false}
        rowKey={(row) => row.id}
      />
    </div>
  );
};

export default Clients;
