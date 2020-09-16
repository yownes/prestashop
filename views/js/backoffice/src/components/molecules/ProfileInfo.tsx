import React from "react";

import styles from "./ProfileInfo.module.css";

interface ProfileInfoProps {
  logo?: string;
  name: string;
  email: string;
}

const ProfileInfo = ({ logo, name, email }: ProfileInfoProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span className={styles.title}>{name}</span>
        <span className={styles.subtitle}>{email}</span>
      </div>
      {logo && <img src={logo} alt="Company logo" className={styles.image} />}
    </div>
  );
};

export default ProfileInfo;
