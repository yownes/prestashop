import React from "react";

import styles from "./TitleWithAction.module.css";

interface TitleWithActionProps {
  title: string;
  action: {
    action: () => void;
    label: string;
  };
}

const TitleWithAction = ({ title, action }: TitleWithActionProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <button className={styles.action} onClick={action.action}>
        {action.label}
      </button>
    </div>
  );
};

export default TitleWithAction;
