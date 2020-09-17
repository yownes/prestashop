import React, { useState } from "react";
import Title from "antd/lib/typography/Title";
import { Input } from "antd";
import { Color } from "../atoms";

interface ColorPickerProps {}

const defaultColors = ["#AF43BE", "#FD8090", "#C4FFFF", "#08DEEA", "#1261D1"];

const ColorPicker = ({}: ColorPickerProps) => {
  const [picked, setPicked] = useState(defaultColors[0]);
  return (
    <div>
      <Title level={3}>Color</Title>
      <div>Muestras de color</div>
      {defaultColors.map((color) => (
        <Color color={color} onClick={() => setPicked(color)} />
      ))}
      <Input
        placeholder="#333333"
        value={picked}
        onChange={(e) => setPicked(e.target.value)}
      />
      <span>Color seleccionado:</span>
      <Color color={picked} size={80}></Color>
    </div>
  );
};

export default ColorPicker;
