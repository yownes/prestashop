import { Radio } from "antd";
import React from "react";
import { RightCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import TemplatePreview from "../molecules/TemplatePreview";

import styles from "./TemplateSelector.module.css";
import Title from "antd/lib/typography/Title";
import { TEMPLATES } from "../../api/queries";
import { Templates } from "../../api/types/Templates";
import Loading from "../atoms/Loading";
import connectionToNodes from "../../lib/connectionToNodes";
import { useTranslation } from "react-i18next";

interface TemplateSelectorProps {
  value?: string;
  onChange: (selected: string) => void;
}

const TemplateSelector = ({ value, onChange }: TemplateSelectorProps) => {
  const { t } = useTranslation("client");
  const { loading, data } = useQuery<Templates>(TEMPLATES);
  if (loading) {
    return <Loading />;
  }
  const templates = connectionToNodes(data?.templates);
  return (
    <div className={styles.container}>
      <Title level={3}>{t("template")}</Title>
      <Radio.Group
        value={value ?? templates[0]?.id}
        onChange={(e) => onChange(e.target.value)}
        style={{ overflowX: "scroll", display: "flex" }}
      >
        {templates.map((template) => (
          <Radio.Button
            value={template.id}
            key={template.id}
            style={{ height: "auto" }}
          >
            <TemplatePreview
              name={template.name ?? ""}
              image={template.previewImg ?? ""}
            />
          </Radio.Button>
        ))}
      </Radio.Group>
      <div className={styles.overlay}>
        <span className={styles.arrow}>
          <RightCircleOutlined style={{ fontSize: "16px", color: "#333" }} />
        </span>
      </div>
    </div>
  );
};

export default TemplateSelector;
