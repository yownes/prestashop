import React from "react";
import { Link } from "react-router-dom";
import { Input } from "antd";

import styles from "./AdminHeader.module.css";

const AdminHeader = () => {
  return (
    <div className={styles.container}>
      <div>
        <Link to="/clients">Clientes</Link>
        <Link to="/builds">Builds</Link>
      </div>
      <div>
        <Input.Search />
      </div>
    </div>
  );
};

export default AdminHeader;
