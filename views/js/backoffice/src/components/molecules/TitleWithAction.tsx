import React, { ReactNode } from "react";
import { Popconfirm, Typography } from "antd";

import styles from "./TitleWithAction.module.css";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

interface TitleWithActionProps {
  title: string;
  action?: {
    action: () => void;
    label: ReactNode;
    needsConfirmation?: boolean;
    confirmationTitle?: ReactNode;
  };
}

const TitleWithAction = ({ title, action }: TitleWithActionProps) => {
  const { t } = useTranslation("cliente");
  return (
    <div className={styles.container}>
      <Title level={2}>{title}</Title>
      {action &&
        (action.needsConfirmation ? (
          <Popconfirm
            placement="bottomRight"
            title={action.confirmationTitle || t("warnings.action")}
            onConfirm={action.action}
          >
            <button className={styles.action}>{action.label}</button>
          </Popconfirm>
        ) : (
          <button className={styles.action} onClick={action.action}>
            {action.label}
          </button>
        ))}
    </div>
  );
};

export default TitleWithAction;
