import React from "react";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

interface VerifiedStateProps {
  verified?: boolean | null;
}

const VerifiedState = ({ verified }: VerifiedStateProps) => {
  return verified ? (
    <CheckCircleTwoTone twoToneColor="#52c41a" />
  ) : (
    <CloseCircleTwoTone twoToneColor="#f5222d" />
  );
};

export default VerifiedState;
