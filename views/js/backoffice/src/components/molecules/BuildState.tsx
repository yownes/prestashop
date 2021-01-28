import { Tag } from "antd";
import React from "react";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import { useTranslation } from "react-i18next";

interface BuildStateProps {
  state: BuildBuildStatus;
}

const COLORS = {
  STALLED: "default",
  QUEUED: "gold",
  GENERATING: "cyan",
  UPLOADING: "magenta",
  PUBLISHED: "green",
  WAITING: "orange",
};

const BuildState = ({ state }: BuildStateProps) => {
  const { t } = useTranslation("client");
  const color = COLORS[state];
  const status = `appStatus.${state}`;
  return <Tag color={color}>{t(status)}</Tag>;
};

export default BuildState;
