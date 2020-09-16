import { Tag } from "antd";
import React from "react";
import { BuildState as IBuildState } from "../../models/App";

interface BuildStateProps {
  state: IBuildState;
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
  const color = COLORS[state];
  return <Tag color={color}>{state}</Tag>;
};

export default BuildState;
