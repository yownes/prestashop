import React from "react";
import { Logo } from "../atoms";
import ProfileInfo from "../molecules/ProfileInfo";
import Auth from "../../lib/auth";

import styles from "./Header.module.css";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const profile = Auth.getSingleton().profile;
  return (
    <header className={styles.container}>
      <Logo />
      {profile && <ProfileInfo {...profile} />}
    </header>
  );
};

export default Header;
