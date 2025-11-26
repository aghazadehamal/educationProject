import React from "react";
import styles from "./ExamBaseFormModal.module.css";

const ExamBaseFormModal = ({
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

  const title =
    mode === "create" ? "Yeni imtahan şablonu əlavə et" : "İmtahan şablonunu redaktə et";

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
            <label className={styles.label}>Başlıq</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={onChange}
              className={styles.input}
              placeholder="İmtahan şablonunun adını daxil edin"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Müddət (dəqiqə)</label>
            <input
              type="number"
              name="durationMinutes"
              value={values.durationMinutes}
              onChange={onChange}
              className={styles.input}
              placeholder="Məsələn: 60"
              min={1}
            />
          </div>

          {mode === "create" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Subject ID</label>
              <input
                type="number"
                name="subjectId"
                value={values.subjectId}
                onChange={onChange}
                className={styles.input}
                placeholder="Fənnin ID dəyərini daxil edin"
                min={1}
              />
            </div>
          )}

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

export default ExamBaseFormModal;
