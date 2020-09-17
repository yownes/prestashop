import React from "react";
import { Typography } from "antd";

import styles from "./TitleWithAction.module.css";

const { Title } = Typography;

interface TitleWithActionProps {
  title: string;
  action?: {
    action: () => void;
    label: string;
  };
}

const TitleWithAction = ({ title, action }: TitleWithActionProps) => {
  return (
    <div className={styles.container}>
      <Title level={2}>{title}</Title>
      {action && (
        (
        <button className={styles.action} onClick={action.action}>
            {action.label}
          </button>
      )
      )}
    </div>
  );
};

export default TitleWithAction;
