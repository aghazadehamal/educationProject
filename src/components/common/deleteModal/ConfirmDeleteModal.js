import React from "react";
import styles from "./ConfirmDeleteModal.module.css";

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Təsdiq edin</h3>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Ləğv et
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
