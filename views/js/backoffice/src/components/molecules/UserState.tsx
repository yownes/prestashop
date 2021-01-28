import React from "react";
import { Tag } from "antd";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import { useTranslation } from "react-i18next";

interface UserStateProps {
  state?: AccountAccountStatus;
}

const COLORS = {
  REGISTERED: "default",
  WAITING_PAYMENT: "orange",
  PAID_ACCOUNT: "green",
  BANNED: "red",
};

const UserState = ({ state }: UserStateProps) => {
  const { t } = useTranslation();
  const selector = state || AccountAccountStatus.REGISTERED;
  const color = COLORS[selector];
  const status = `accountStatus.${selector}`;
  return <Tag color={color}>{t(status)}</Tag>;
};

export default UserState;
