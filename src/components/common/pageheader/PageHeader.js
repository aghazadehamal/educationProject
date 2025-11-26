import React from "react";
import styles from "./PageHeader.module.css";

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.accentDot} />
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

     
    </div>
  );
};

export default PageHeader;
