import React from "react";
import { Logo } from "../atoms";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <header>
      <Logo />
    </header>
  );
};

export default Header;
