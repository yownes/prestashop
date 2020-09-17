import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import styles from "./SubscribePlaceholder.module.css";

const SubscribePlaceholder = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Suscríbete para poder tener tu propia app
      </h2>
      <Link to="/pay">
        <Button>Suscribirse</Button>
      </Link>
    </div>
  );
};

export default SubscribePlaceholder;
