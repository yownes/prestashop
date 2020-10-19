import React from "react";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import Paragraph from "antd/lib/typography/Paragraph";
import { Input, Radio } from "antd";
import { Color } from "../atoms";

type ColorInput = { color: string; text: "white" | "black" };

interface ColorPickerProps {
  value?: ColorInput;
  onChange: (change: ColorInput) => void;
}

const defaultColors = ["#AF43BE", "#FD8090", "#C4FFFF", "#08DEEA", "#1261D1"];

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div>
      <Title level={3}>Color</Title>

      <Paragraph>Muestras de color:</Paragraph>
      <div style={{ display: "flex", gap: 15 }}>
        {defaultColors.map((color) => (
          <Color
            color={color}
            onClick={() => onChange({ color, text: value?.text ?? "white" })}
          />
        ))}
      </div>

      <Paragraph>Color seleccionado:</Paragraph>

      <Input
        placeholder="#333333"
        style={{ width: 150 }}
        value={value?.color ?? defaultColors[0]}
        onChange={(e) =>
          onChange({ color: e.target.value, text: value?.text ?? "white" })
        }
      />
      <div>
        <Color color={value?.color ?? defaultColors[0]} size={80}></Color>
      </div>
      <Paragraph>Texto:</Paragraph>
      <Radio.Group
        name="text"
        value={value?.text ?? "white"}
        onChange={(e) => {
          onChange({
            color: value?.color ?? defaultColors[0],
            text: e.target.value,
          });
        }}
      >
        <Radio value="white">
          <span
            style={{
              backgroundColor: value?.color,
              color: "white",
              padding: "1rem",
            }}
          >
            Blanco
          </span>
        </Radio>
        <Radio value="black">
          <span
            style={{
              backgroundColor: value?.color,
              color: "black",
              padding: "1rem",
            }}
          >
            Negro
          </span>
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default ColorPicker;
