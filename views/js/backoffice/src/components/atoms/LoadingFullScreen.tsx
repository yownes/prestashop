import React from "react";
import { Spin } from "antd";

interface LoadingFullScreenProps {
  tip: string;
}

const LoadingFullScreen = ({ tip }: LoadingFullScreenProps) => {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "rgba(75, 74, 75, 0.5)",
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        width: "100%",
        zIndex: 999,
      }}
    >
      <Spin size="large" tip={tip} />
    </div>
  );
};

export default LoadingFullScreen;
