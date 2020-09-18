import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import styles from "./ProfileInfo.module.css";

interface ProfileInfoProps {
  logo?: string;
  name: string;
  email: string;
  reverse?: boolean;
  editable?: boolean;
}

const ProfileInfo = ({
  logo,
  name,
  email,
  reverse,
  editable,
}: ProfileInfoProps) => {
  return (
    <Link to="/profile">
      <div className={`${styles.container} ${reverse ? styles.reverse : ""}`}>
        <div className={`${styles.info} ${reverse ? styles.alignLeft : ""}`}>
                  <span className={styles.title}>
            
            <Typography.Paragraph editable={editable ? {} : false}>
              
              {name}
            
            </Typography.Paragraph>
          
          </span>
          <span className={styles.subtitle}>{email}</span>
        </div>
        {logo && <img src={logo} alt="Company logo" className={styles.image} />}
      </div>
    </Link>
  );
};

ProfileInfo.defaultProps = {
  reverse: false,
  editable: false,
};

export default ProfileInfo;
