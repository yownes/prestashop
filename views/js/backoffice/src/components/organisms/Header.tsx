import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Typography } from "antd";
import { Logo } from "../atoms";
import ProfileInfo from "../molecules/ProfileInfo";
import Auth from "../../lib/auth";
import routes from "../../lib/routes";

import styles from "./Header.module.css";

const Header = () => {
  const profile = Auth.getSingleton().profile;
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
      <Typography.Title level={2}>{route?.name}</Typography.Title>
      {profile && <ProfileInfo {...profile} />}
    </header>
  );
};

export default Header;
