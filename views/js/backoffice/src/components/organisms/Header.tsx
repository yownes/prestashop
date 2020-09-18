import React from "react";
import { Logo } from "../atoms";
import ProfileInfo from "../molecules/ProfileInfo";
import Auth from "../../lib/auth";

import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  const profile = Auth.getSingleton().profile;
  return (
    <header className={styles.container}>
      <Link to="/">
        <Logo />
      </Link>
      {profile && <ProfileInfo {...profile} />}
    </header>
  );
};

export default Header;
