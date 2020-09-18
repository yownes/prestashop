import { Radio } from "antd";
import React, { useState } from "react";
import { RightCircleOutlined } from "@ant-design/icons";
import { Template } from "../../models/App";
import TemplatePreview from "../molecules/TemplatePreview";

import styles from "./TemplateSelector.module.css";
import Title from "antd/lib/typography/Title";

interface TemplateSelectorProps {
  value?: string;
  onChange: (selected: string) => void;
}

const templates: Template[] = [
  {
    id: "1",
    name: "Default",
    previewImg:
      "https://static.dribbble.com/users/951149/screenshots/6106992/dribble_rns1_2x.png",
  },
  {
    id: "2",
    name: "Fancy",
    previewImg:
      "https://assets.materialup.com/uploads/2c89d81f-da73-46da-99ac-3d07910d44cb/preview.jpg",
  },
  {
    id: "3",
    name: "Fancy2",
    previewImg:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR7a13XF_HHBEkI0WuwyCxidnT6L-JvngJHgg&usqp=CAU",
  },
  {
    id: "4",
    name: "Fancy3",
    previewImg:
      "https://i.pinimg.com/originals/c0/6e/3a/c06e3a76c51e1b625bdd258f31a7cb32.jpg",
  },
  {
    id: "5",
    name: "Fancy4",
    previewImg:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT0Or98OibYZdQ6_AOcNNShsPG7dhyUlwB0Pg&usqp=CAU",
  },
];

const TemplateSelector = ({ value, onChange }: TemplateSelectorProps) => {
  return (
    <div className={styles.container}>
      <Title level={3}>Plantilla</Title>
      <Radio.Group
        value={value ?? templates[templates.length -   1].id}
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
