
import React from "react";
import styles from "./SubjectFormModal.module.css";

const SubjectFormModal = ({
  isOpen,
  mode,
  values,
  onChange,
  onClose,
  onSubmit,
  saving,
  error,
}) => {
  if (!isOpen) return null;

  const title = mode === "create" ? "Yeni fənn əlavə et" : "Fənni redaktə et";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Bağla"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Fənn adı</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={onChange}
              className={styles.input}
              placeholder="Fənn adını daxil edin"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Təsvir</label>
            <textarea
              name="description"
              value={values.description}
              onChange={onChange}
              className={styles.textarea}
              placeholder="Fənn haqqında qısa təsvir"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Ləğv et
            </button>

            <button
              type="submit"
              disabled={saving}
              className={styles.submitBtn}
            >
              {saving
                ? "Yadda saxlanılır..."
                : mode === "create"
                ? "Əlavə et"
                : "Yadda saxla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectFormModal;
