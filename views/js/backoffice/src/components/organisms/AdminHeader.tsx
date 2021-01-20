import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { BuildOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const AdminHeader = () => {
  const { t } = useTranslation("admin");
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname.slice(1));
  return (
    <Menu
      onClick={(state) => setCurrent(String(state.key))}
      selectedKeys={[current]}
      mode="horizontal"
    >
      <Menu.Item key="clients" icon={<UserOutlined />}>
        <Link to="/clients">{t("clients")}</Link>
      </Menu.Item>
      <Menu.Item key="builds" icon={<BuildOutlined />}>
        <Link to="/builds">{t("builds")}</Link>
      </Menu.Item>
    </Menu>
  );
};

export default AdminHeader;
