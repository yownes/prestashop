import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { BuildOutlined, IdcardOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const AdminHeader = () => {
  const { t } = useTranslation("admin");
  const location = useLocation();
  return (
    <Menu selectedKeys={[location.pathname.slice(1)]} mode="horizontal">
      <Menu.Item key="clients" icon={<UserOutlined />}>
        <Link to="/clients">{t("clients")}</Link>
      </Menu.Item>
      <Menu.Item key="builds" icon={<BuildOutlined />}>
        <Link to="/builds">{t("builds")}</Link>
      </Menu.Item>
      <Menu.Item key="profile" icon={<IdcardOutlined />}>
        <Link to="/profile">{t("profile")}</Link>
      </Menu.Item>
    </Menu>
  );
};

export default AdminHeader;
