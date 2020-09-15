import React from "react";
import { Logo } from "../atoms";

import styles from "./Auth.module.css";

interface AuthProps {
  background: string;
  children: React.ReactNode;
}

const Auth = ({ background, children }: AuthProps) => {
  return (
    <main
      className={styles.auth}
      style={{ backgroundImage: `url(${background})` }}
    >
      <Logo width={300} height={104} />
      <div className={styles.auth__container}>{children}</div>
    </main>
  );
};

export default Auth;
