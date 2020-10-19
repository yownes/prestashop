import React from "react";
import { Dropdown, Menu } from "antd";
import { Link, useHistory } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
import Auth from "../../lib/auth";

import styles from "./ProfileInfo.module.css";

interface ProfileInfoProps {
  logo?: string;
  name: string;
  email: string;
  reverse?: boolean;
  editable?: boolean;
}

const ProfileInfo = ({
  logo,
  name,
  email,
  reverse,
  editable,
}: ProfileInfoProps) => {
  const history = useHistory()

  const menu = (
    <Menu>
      <Menu.Item key="0"><Link to="/profile">Perfil</Link></Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => {
        Auth.getSingleton().logout(() => {
          history.replace("/");
        })
      }} key="1">Cerrar sesión</Menu.Item>
    </Menu>
  )
  return (
    <div className={`${styles.container} ${reverse ? styles.reverse : ""}`}>
        <div className={`${styles.info} ${reverse ? styles.alignLeft : ""}`}>
          <span className={styles.title}>
      <Link to="/profile">
              {name}
        </Link>
          </span>
          <span className={styles.subtitle}>{email}</span>
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <EllipsisOutlined />
        </Dropdown>
      </div>
  );
};

ProfileInfo.defaultProps = {
  reverse: false,
  editable: false,
};

export default ProfileInfo;
