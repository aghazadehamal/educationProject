import React from "react";
import styles from "./ExamPanelPage.module.css";

const ExamFormModal = ({
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

  const isEdit = mode === "edit";
  const title = isEdit ? "İmtahanı redaktə et" : "Yeni imtahan yarat";

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{title}</h2>

        <form onSubmit={onSubmit} className={styles.modalForm}>
          {!isEdit && (
            <label className={styles.modalLabel}>
              Exam base ID
              <input
                type="number"
                name="examBaseId"
                value={values.examBaseId}
                onChange={onChange}
                className={styles.modalInput}
                placeholder="Məsələn: 1"
                min={1}
                required
              />
            </label>
          )}

          <label className={styles.modalLabel}>
            Tələbə nömrələri
            <input
              type="text"
              name="assignedStudentNumbers"
              value={values.assignedStudentNumbers}
              onChange={onChange}
              className={styles.modalInput}
              placeholder="1526968060, 1234567890"
            />
          </label>

          <label className={styles.modalLabel}>
            Başlama tarixi/saatı (ISO)
            <input
              type="text"
              name="scheduledStartTime"
              value={values.scheduledStartTime}
              onChange={onChange}
              className={styles.modalInput}
              placeholder="2025-11-30T10:00:00.000Z"
              required
            />
          </label>

          <label className={styles.modalLabel}>
            Bitmə tarixi/saatı (ISO)
            <input
              type="text"
              name="scheduledEndTime"
              value={values.scheduledEndTime}
              onChange={onChange}
              className={styles.modalInput}
              placeholder="2025-11-30T11:00:00.000Z"
              required
            />
          </label>

          <label className={styles.modalLabel}>
            Qeyd
            <textarea
              name="note"
              value={values.note}
              onChange={onChange}
              className={styles.modalTextarea}
              rows={3}
              placeholder="İmtahanla bağlı əlavə qeyd"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.secondaryButton}
              disabled={saving}
            >
              Ləğv et
            </button>

            <button
              type="submit"
              disabled={saving}
              className={styles.primaryButton}
            >
              {saving
                ? "Yadda saxlanılır..."
                : isEdit
                ? "Yadda saxla"
                : "Əlavə et"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamFormModal;
