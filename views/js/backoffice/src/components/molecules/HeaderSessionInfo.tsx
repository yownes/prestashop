import React from "react";
import { Button, Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
import { useAuth } from "../../lib/auth";

import styles from "./HeaderSessionInfo.module.css";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useTranslation } from "react-i18next";

interface HeaderSessionInfoProps {
  name: string;
  email: string;
}

const HeaderSessionInfo = ({ name, email }: HeaderSessionInfoProps) => {
  const { logout } = useAuth();
  const screens = useBreakpoint();
  const { t } = useTranslation();

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/profile">{t("profile")}</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        onClick={() => {
          logout?.();
        }}
        key="1"
      >
        {t("logout")}
      </Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.container}>
      {screens.md && (
        <div className={styles.info}>
          <span className={styles.title}>
            <Link to="/profile">{name}</Link>
          </span>
          <span className={styles.subtitle}>{email}</span>
        </div>
      )}
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button icon={<EllipsisOutlined />} shape="circle" />
      </Dropdown>
    </div>
  );
};

HeaderSessionInfo.defaultProps = {
  reverse: false,
  editable: false,
};

export default HeaderSessionInfo;
