import React from "react";
import { Tag } from "antd";
import { AccountAccountStatus } from "../../api/types/globalTypes";

interface UserStateProps {
  state?: AccountAccountStatus;
}

// TODO: state -> COLORS
const COLORS = {
  REGISTERED: "default",
  WAITING_PAYMENT: "orange",
  PAID_ACCOUNT: "green",
  BANNED: "red",
};

const UserState = ({ state }: UserStateProps) => {
  const selector = state || AccountAccountStatus.REGISTERED;
  const color = COLORS[selector];
  return <Tag color={color}>{state}</Tag>;
};

export default UserState;
