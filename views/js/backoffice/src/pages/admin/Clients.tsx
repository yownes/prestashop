import React from "react";
import { Table } from "antd";
import forIn from "lodash/forIn";
import { useQuery } from "@apollo/client";
import { ColumnsType } from "antd/lib/table";
import { Link, useHistory } from "react-router-dom";
import { CLIENTS, PLANS } from "../../api/queries";
import {
  Clients as IClients,
  ClientsVariables,
  Clients_users_edges_node,
  Clients_users_edges_node_apps_edges,
  Clients_users_edges_node_subscription_plan_product,
} from "../../api/types/Clients";
import { Plans } from "../../api/types/Plans";
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
import styles from "./Clients.module.css";

interface IPlan {
  id: string;
  name: string;
}

function getAccountStatusFilters() {
  let filters: Filter[] = [];
  forIn(AccountAccountStatus, (value) => {
    filters.push({ text: <UserState state={value}></UserState>, value: value });
  });
  return filters;
}

function getSubscriptionFilters(plans: IPlan[]) {
  let filters: Filter[] = [];
  for (let plan of plans) {
    filters.push({ text: plan.name, value: plan.name });
  }
  filters.push({ text: "Sin suscripción", value: "-" });
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
  const { data: plansData } = useQuery<Plans>(PLANS);
  const dataSource = connectionToNodes(data?.users).filter(
    (data) => !data.isStaff
  );
  const plans: IPlan[] = connectionToNodes(plansData?.products).map((data) => ({
    id: data.id,
    name: data.name,
  }));
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
      title: t("plan"),
      dataIndex: ["subscription", "plan", "product"]
        ? ["subscription", "plan", "product", "name"]
        : "-",
      key: "subscription",
      render: (product: Clients_users_edges_node_subscription_plan_product) =>
        product ?? "-",
      ...getColumnFilterProps<Clients_users_edges_node>(
        ["subscription", "plan", "product", "name"],
        getSubscriptionFilters(plans)
      ),
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
    {
      title: t("isActive"),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <VerifiedState verified={isActive} />,
      ...getColumnFilterProps<Clients_users_edges_node>(
        ["isActive"],
        getVerifiedStatusFilters()
      ),
      sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        onRow={(record) => {
          return { onClick: () => history.push(`/clients/${record.id}`) };
        }}
        rowClassName={styles.row}
        rowKey={(row) => row.id}
      />
    </div>
  );
};

export default Clients;
