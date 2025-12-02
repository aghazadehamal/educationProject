import React from "react";
import ReactDOM from "react-dom";
import styles from "./LogoutConfirmModal.module.css";

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Çıxış etmək istəyirsiniz?</h3>
        <p className={styles.subtitle}>
          Hesabdan çıxış etdikdən sonra yenidən daxil olmalı olacaqsınız.
        </p>

        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Ləğv et
          </button>
          <button onClick={onConfirm} className={styles.logoutBtn}>
            Çıxış et
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutConfirmModal;
