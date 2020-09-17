import React from "react";
import { Link } from "react-router-dom";

import styles from "./ProfileInfo.module.css";

interface ProfileInfoProps {
  logo?: string;
  name: string;
  email: string;
}

const ProfileInfo = ({ logo, name, email }: ProfileInfoProps) => {
  return (
    <Link to="/profile">

    <div className={styles.container}>
      <div className={styles.info}>
        <span className={styles.title}>{name}</span>
        <span className={styles.subtitle}>{email}</span>
      </div>
      {logo && <img src={logo} alt="Company logo" className={styles.image} />}
    </div>
    </Link>
  );
};

export default ProfileInfo;
