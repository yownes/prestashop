import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Typography } from "antd";
import { useQuery } from "@apollo/client";
import { Logo } from "../atoms";
import HeaderSessionInfo from "../molecules/HeaderSessionInfo";
import clientRoutes from "../../lib/routes";
import adminoutes from "../../lib/adminRoutes";

import { ME } from "../../api/queries";
import { Me } from "../../api/types/Me";

import styles from "./Header.module.css";
import { RightOutlined } from "@ant-design/icons";

const routes = [...clientRoutes, ...adminoutes];

const Header = () => {
  const { data } = useQuery<Me>(ME);
  const location = useLocation();
  let route = routes.find(
    (r) => r.path === location.pathname && r.admin === data?.me?.isStaff
  );
  if (!route) {
    route = routes
      .filter((r) => /:\w+/.exec(r.path))
      .map((r) => {
        const path = r.path.replace(/:\w+/, "");
        return {
          ...r,
          path,
        };
      })
      .find((r) => location.pathname.includes(r.path));
  }

  return (
    <header className={styles.container}>
      <Link to="/">
        <Logo />
      </Link>
      <Typography.Title level={2} className={styles.title}>
        {route?.name && data?.me?.isStaff === route.admin && (
          <>
            <RightOutlined className={styles.titleIcon} />
            {route?.name}
          </>
        )}
      </Typography.Title>
      {data?.me?.email && (
        <HeaderSessionInfo email={data.me.email} name={data.me.username} />
      )}
    </header>
  );
};

export default Header;
