import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import styles from "./Placeholder.module.css";

interface PlaceholderProps {
  cta: { title: string; link: string };
  claim: string;
  image?: string;
}

const Placeholder = ({ claim, image, cta }: PlaceholderProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{claim}</h2>
      {image && <img src={styles.image} alt="claim" />}
      <Link to={cta.link}>
        <Button>{cta.title}</Button>
      </Link>
    </div>
  );
};

export default Placeholder;
