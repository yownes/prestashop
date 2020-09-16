import React from "react";
import { Logo } from "../atoms";

import styles from "./Header.module.css";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <header className={styles.container}>
      <Logo />
    </header>
  );
};

export default Header;
