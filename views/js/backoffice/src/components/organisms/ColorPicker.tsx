import React from "react";
import Title from "antd/lib/typography/Title";
import { Input } from "antd";
import { Color } from "../atoms";

interface ColorPickerProps {
  value?: string;
  onChange: (selected: string) => void;
}

const defaultColors = ["#AF43BE", "#FD8090", "#C4FFFF", "#08DEEA", "#1261D1"];

const ColorPicker = ({value, onChange}: ColorPickerProps) => {
  return (
    <div>
      <Title level={3}>Color</Title>
      <div>Muestras de color</div>
      {defaultColors.map((color) => (
        <Color color={color} onClick={() => onChange(color)} />
      ))}
      <Input
        placeholder="#333333"
        value={ value ?? defaultColors[0]}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>Color seleccionado:</span>
      <Color color={value ?? defaultColors[0]} size={80}></Color>
    </div>
  );
};

export default ColorPicker;
