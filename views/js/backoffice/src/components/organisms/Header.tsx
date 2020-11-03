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

const routes = [...clientRoutes, ...adminoutes];

const Header = () => {
  const { data } = useQuery<Me>(ME);
  const location = useLocation();
  let route = routes.find((r) => r.path === location.pathname);
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
      <Typography.Title level={2} style={{ color: "#00ec93" }}>
        <span style={{ color: "#333" }}>{">"}</span> {route?.name}
      </Typography.Title>
      {data?.me?.email && (
        <HeaderSessionInfo email={data.me.email} name={data.me.username} />
      )}
    </header>
  );
};

export default Header;
